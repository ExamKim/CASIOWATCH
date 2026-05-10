const { pool } = require("../config/db");

async function addToCart(userId, productId, quantity) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Khóa hàng sản phẩm để lấy tồn kho mới nhất và ngăn chặn các yêu cầu khác can thiệp cùng lúc
        const [[product]] = await connection.query(
            "SELECT name, stock, status FROM products WHERE id = ? FOR UPDATE",
            [productId]
        );

        if (!product || product.status === 'deleted') {
            throw new Error("Sản phẩm không tồn tại hoặc đã bị ngừng kinh doanh");
        }

        const addedQty = Number(quantity);

        // 2. Lấy TỔNG số lượng hiện có trong giỏ của user (dùng SUM để phòng hờ DB thiếu UNIQUE)
        const [[existingItem]] = await connection.query(
            "SELECT SUM(quantity) as quantity FROM cart_items WHERE user_id = ? AND product_id = ? FOR UPDATE",
            [userId, productId]
        );

        const currentQtyInCart = existingItem && existingItem.quantity ? Number(existingItem.quantity) : 0;
        const totalAfterAdd = currentQtyInCart + addedQty;

        // 3. Kiểm tra nghiêm ngặt
        if (product.stock < totalAfterAdd) {
            if (product.stock <= 0) {
                throw new Error(`Sản phẩm "${product.name}" đã hết hàng`);
            }
            throw new Error(`Kho chỉ còn ${product.stock} sản phẩm. Trong giỏ bạn đã có ${currentQtyInCart}, không thể thêm thêm ${addedQty} nữa.`);
        }

        // 4. Xóa các dòng cũ (nếu có bị trùng lặp do lỗi DB) và Insert 1 dòng duy nhất đã cộng dồn
        await connection.query("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?", [userId, productId]);
        await connection.query(
            "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
            [userId, productId, totalAfterAdd]
        );

        await connection.commit();
        return { success: true };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

async function getCartByUserId(userId) {
    // Join với bảng products để lấy tên, giá, ảnh và TỒN KHO
    const [rows] = await pool.query(
        `SELECT c.*, p.name, p.price, p.sale_price, p.stock,
                CASE
                    WHEN p.sale_price IS NOT NULL AND p.sale_price > 0 AND p.sale_price < p.price THEN p.sale_price
                    ELSE p.price
                END AS effective_price,
                p.image_url 
         FROM cart_items c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.user_id = ? AND p.status <> 'deleted'`, [userId]
    );
    return rows;
}

// Thay thế hàm updateCart cũ bằng updateCartItem (theo từng sản phẩm)
async function updateCartItem(userId, productId, quantity) {
    const [[product]] = await pool.query("SELECT name, stock FROM products WHERE id = ?", [productId]);
    const requestedQty = Number(quantity);

    if (product && product.stock < requestedQty) {
        throw new Error(`Không thể cập nhật: Sản phẩm "${product.name}" chỉ còn ${product.stock} chiếc`);
    }

    await pool.query(
        "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
        [requestedQty, userId, productId]
    );
    return { success: true };
}

// Thêm hàm removeFromCart
async function removeFromCart(userId, productId) {
    await pool.query(
        "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
        [userId, productId]
    );
    return { success: true };
}

async function clearCart(userId) {
    await pool.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
    return { success: true };
}

module.exports = {
    getCartByUserId,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
};
