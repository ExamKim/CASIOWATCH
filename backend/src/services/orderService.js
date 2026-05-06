const { pool } = require("../config/db");
const productService = require("./productService");

async function createOrderFromCart(userId, selectedProductIds = [], buyNowProductId = null) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [cartItems] = await connection.query(
            `SELECT c.product_id, c.quantity, p.name, p.price
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
            const product = await productService.findById(directProductId);

            if (!product) {
                const err = new Error("Product not found");
                err.status = 404;
                throw err;
            }

            const directPrice = Number(product.sale_price) > 0 && Number(product.sale_price) < Number(product.price)
                ? Number(product.sale_price)
                : Number(product.price);

            const [orderResult] = await connection.query(
                "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'pending')",
                [userId, directPrice]
            );

            const orderId = orderResult.insertId;

            await connection.query(
                "INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)",
                [orderId, product.id, product.name, directPrice, 1]
            );

            await connection.commit();
            return { id: orderId, status: "pending", total_price: directPrice };
        }

        const finalCartItems = hasSelected
            ? cartItems.filter((item) => selectedIdSet.has(Number(item.product_id)))
            : cartItems;

        if (finalCartItems.length === 0) {
            const err = new Error("Cart is empty");
            err.status = 400;
            throw err;
        }

        const totalPrice = finalCartItems.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0
        );

        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'pending')",
            [userId, totalPrice]
        );

        const orderId = orderResult.insertId;
        const orderItemValues = finalCartItems.map((item) => [
            orderId,
            item.product_id,
            item.name,
            item.price,
            item.quantity,
        ]);

        await connection.query(
            "INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES ?",
            [orderItemValues]
        );

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
        return { id: orderId, status: "pending", total_price: totalPrice };
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
    const [[order]] = await pool.query("SELECT * FROM orders WHERE id = ?", [orderId]);
    if (!order) return null;

    const [items] = await pool.query(
        "SELECT id, order_id, product_id, name, price, quantity FROM order_items WHERE order_id = ?",
        [orderId]
    );

    return { ...order, items };
}

async function cancelOrder({ orderId, userId }) {
    const [[order]] = await pool.query("SELECT * FROM orders WHERE id = ?", [orderId]);

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
    if (["cancelled", "completed", "delivered"].includes(currentStatus)) {
        const err = new Error("Order cannot be cancelled");
        err.status = 400;
        throw err;
    }

    await pool.query(
        `UPDATE orders
         SET status = 'cancelled',
             payment_status = CASE
               WHEN payment_status IS NULL OR payment_status IN ('unpaid', 'pending', 'failed') THEN 'cancelled'
               ELSE payment_status
             END
         WHERE id = ?`,
        [orderId]
    );

    return getOrderDetail(orderId);
}

module.exports = {
    createOrderFromCart,
    getMyOrders,
    getOrderDetail,
    cancelOrder,
};
