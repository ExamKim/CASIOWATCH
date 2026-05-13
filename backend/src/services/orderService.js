const { pool } = require("../config/db");
const productService = require("./productService");

async function createOrderFromCart(userId, selectedProductIds = [], buyNowProductId = null, shippingInfo = {}) {
    const { address = null, phone = null, note = null, recipient = null, buyNowQuantity = 1 } = shippingInfo;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [cartItems] = await connection.query(
            `SELECT c.product_id, c.quantity, p.name, p.price, p.sale_price
             FROM cart_items c
             JOIN products p ON p.id = c.product_id
             WHERE c.user_id = ?`,
            [userId]
        );

        const selectedIds = Array.isArray(selectedProductIds)
            ? selectedProductIds
                .map((value) => Number(value))
                .filter((value) => Number.isInteger(value) && value > 0)
            : [];

        const hasSelected = selectedIds.length > 0;
        const selectedIdSet = new Set(selectedIds);

        const directProductId = Number(buyNowProductId);

        if (Number.isInteger(directProductId) && directProductId > 0) {
            // Buy-now: Lock product row, check stock, deduct stock
            const [[product]] = await connection.query(
                `SELECT id, name, price, sale_price, stock
                 FROM products
                 WHERE id = ?
                 FOR UPDATE`,
                [directProductId]
            );

            if (!product) {
                const err = new Error("Product not found");
                err.status = 404;
                throw err;
            }

            const stock = Number(product.stock || 0);
            if (stock < buyNowQuantity) {
                if (stock <= 0) {
                    const err = new Error(`Sản phẩm "${product.name}" đã hết hàng`);
                    err.status = 400;
                    throw err;
                }
                const err = new Error(`Kho chỉ còn ${stock} sản phẩm. Không thể mua ${buyNowQuantity} chiếc.`);
                err.status = 400;
                throw err;
            }

            const directPrice = Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price)
                ? Number(product.sale_price)
                : Number(product.price);

            const [orderTableCols] = await connection.query("SHOW COLUMNS FROM orders");
            const availableCols = new Set(orderTableCols.map(c => (c.Field || c.field || "").toLowerCase()));

            const orderCols = ["user_id", "total_price", "status"];
            const orderPlaceholders = ["?", "?", "?"];
            const orderParams = [userId, directPrice * buyNowQuantity, "pending"];
            if (address && availableCols.has("address")) {
                orderCols.push("address");
                orderPlaceholders.push("?");
                orderParams.push(address);
            }
            if (phone && availableCols.has("phone")) {
                orderCols.push("phone");
                orderPlaceholders.push("?");
                orderParams.push(phone);
            }
            if (note && availableCols.has("note")) {
                orderCols.push("note");
                orderPlaceholders.push("?");
                orderParams.push(note);
            }
            if (recipient && availableCols.has("recipient")) {
                orderCols.push("recipient");
                orderPlaceholders.push("?");
                orderParams.push(recipient);
            }

            const [orderResult] = await connection.query(
                `INSERT INTO orders (${orderCols.join(", ")}) VALUES (${orderPlaceholders.join(", ")})`,
                orderParams
            );

            const orderId = orderResult.insertId;

            await connection.query(
                "INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)",
                [orderId, product.id, product.name, directPrice, buyNowQuantity]
            );

            // Deduct stock
            await connection.query(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                [buyNowQuantity, directProductId]
            );

            await connection.commit();
            return getOrderDetail(orderId);
        }

        const finalCartItems = hasSelected
            ? cartItems.filter((item) => selectedIdSet.has(Number(item.product_id)))
            : cartItems;

        if (finalCartItems.length === 0) {
            const err = new Error("Cart is empty");
            err.status = 400;
            throw err;
        }

        // Lock all cart item products, verify stock and get current prices
        const productIds = finalCartItems.map((item) => Number(item.product_id));
        const placeholders = productIds.map(() => "?").join(",");
        const [productLockResults] = await connection.query(
            `SELECT id, name, price, sale_price, stock FROM products WHERE id IN (${placeholders}) FOR UPDATE`,
            productIds
        );

        const priceByProductId = {};
        const stockByProductId = {};
        for (const p of productLockResults) {
            const productId = Number(p.id);
            const price = Number(p.price || 0);
            const salePrice = Number(p.sale_price || 0);
            const finalPrice = salePrice > 0 && salePrice < price ? salePrice : price;

            priceByProductId[productId] = finalPrice;
            stockByProductId[productId] = { name: p.name, stock: Number(p.stock || 0) };
        }

        // Check stock for each cart item
        for (const item of finalCartItems) {
            const productId = Number(item.product_id);
            const quantity = Number(item.quantity || 1);
            const stockInfo = stockByProductId[productId];

            if (!stockInfo) {
                const err = new Error(`Sản phẩm ID ${productId} không tồn tại`);
                err.status = 404;
                throw err;
            }

            if (stockInfo.stock < quantity) {
                const err = new Error(`Sản phẩm "${stockInfo.name}" chỉ còn ${stockInfo.stock} chiếc, không đủ ${quantity} chiếc`);
                err.status = 400;
                throw err;
            }
        }

        // Calculate total price using sale_price if available
        const totalPrice = finalCartItems.reduce((sum, item) => {
            const productId = Number(item.product_id);
            const itemPrice = priceByProductId[productId] || Number(item.price || 0);
            const quantity = Number(item.quantity || 1);
            return sum + itemPrice * quantity;
        }, 0);

        const [orderTableCols] = await connection.query("SHOW COLUMNS FROM orders");
        const availableCols = new Set(orderTableCols.map(c => (c.Field || c.field || "").toLowerCase()));

        const orderCols = ["user_id", "total_price", "status"];
        const orderPlaceholders = ["?", "?", "?"];
        const orderParams = [userId, totalPrice, "pending"];
        if (address && availableCols.has("address")) {
            orderCols.push("address");
            orderPlaceholders.push("?");
            orderParams.push(address);
        }
        if (phone && availableCols.has("phone")) {
            orderCols.push("phone");
            orderPlaceholders.push("?");
            orderParams.push(phone);
        }
        if (note && availableCols.has("note")) {
            orderCols.push("note");
            orderPlaceholders.push("?");
            orderParams.push(note);
        }
        if (recipient && availableCols.has("recipient")) {
            orderCols.push("recipient");
            orderPlaceholders.push("?");
            orderParams.push(recipient);
        }

        const [orderResult] = await connection.query(
            `INSERT INTO orders (${orderCols.join(", ")}) VALUES (${orderPlaceholders.join(", ")})`,
            orderParams
        );

        const orderId = orderResult.insertId;
        const orderItemValues = finalCartItems.map((item) => {
            const productId = Number(item.product_id);
            const itemPrice = priceByProductId[productId] || Number(item.price || 0);
            return [
                orderId,
                productId,
                item.name,
                itemPrice,
                Number(item.quantity || 1),
            ];
        });

        await connection.query(
            "INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES ?",
            [orderItemValues]
        );

        // Deduct stock for all items
        for (const item of finalCartItems) {
            const quantity = Number(item.quantity || 1);
            await connection.query(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                [quantity, Number(item.product_id)]
            );
        }

        if (hasSelected) {
            const placeholders = selectedIds.map(() => "?").join(",");
            await connection.query(
                `DELETE FROM cart_items WHERE user_id = ? AND product_id IN (${placeholders})`,
                [userId, ...selectedIds]
            );
        } else {
            await connection.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
        }

        await connection.commit();
        return getOrderDetail(orderId);
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

async function getMyOrders(userId) {
    const [rows] = await pool.query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC, id DESC",
        [userId]
    );
    return rows;
}

async function getOrderDetail(orderId) {
    const [orderTableCols] = await pool.query("SHOW COLUMNS FROM orders");
    const availableCols = new Set(orderTableCols.map((c) => (c.Field || c.field || "").toLowerCase()));

    const selectAddress = availableCols.has("address") ? "o.address AS address" : "NULL AS address";
    const selectPhone = availableCols.has("phone") ? "o.phone" : "NULL";
    const selectNote = availableCols.has("note") ? "o.note" : "NULL";
    const selectRecipient = availableCols.has("recipient") ? "o.recipient" : "NULL";

    const [[order]] = await pool.query(
        `SELECT o.*, 
                COALESCE(${selectRecipient}, u.username) AS recipient,
                ${selectAddress} AS address, 
                ${selectPhone} AS phone, 
                ${selectNote} AS note 
         FROM orders o 
         LEFT JOIN users u ON u.id = o.user_id
         WHERE o.id = ?`,
        [orderId]
    );
    if (!order) return null;

    const [items] = await pool.query(
        "SELECT id, order_id, product_id, name, price, quantity FROM order_items WHERE order_id = ?",
        [orderId]
    );

    return { ...order, items };
}

async function cancelOrder({ orderId, userId }) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [[order]] = await connection.query("SELECT * FROM orders WHERE id = ? FOR UPDATE", [orderId]);

        if (!order) {
            const err = new Error("Order not found");
            err.status = 404;
            throw err;
        }

        if (Number(order.user_id) !== Number(userId)) {
            const err = new Error("Forbidden");
            err.status = 403;
            throw err;
        }

        const currentStatus = String(order.status || "").toLowerCase();
        const paymentStatus = String(order.payment_status || "").toLowerCase();

        if (["cancelled", "completed", "delivered"].includes(currentStatus)) {
            const err = new Error("Order cannot be cancelled");
            err.status = 400;
            throw err;
        }

        if (paymentStatus === "paid") {
            const err = new Error("Cannot cancel order that has been paid. Please contact support for refund requests.");
            err.status = 400;
            throw err;
        }

        // Restore stock for all items in the order
        const [items] = await connection.query(
            "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
            [orderId]
        );

        for (const item of items) {
            await connection.query(
                "UPDATE products SET stock = stock + ? WHERE id = ?",
                [Number(item.quantity), Number(item.product_id)]
            );
        }

        await connection.query(
            `UPDATE orders
             SET status = 'cancelled',
                 payment_status = CASE
                   WHEN payment_status IS NULL OR payment_status IN ('unpaid', 'pending', 'failed') THEN 'cancelled'
                   ELSE payment_status
                 END
             WHERE id = ?`,
            [orderId]
        );

        await connection.commit();
        return getOrderDetail(orderId);
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = {
    createOrderFromCart,
    getMyOrders,
    getOrderDetail,
    cancelOrder,
};
