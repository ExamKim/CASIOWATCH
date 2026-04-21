const { pool } = require("../config/db");

async function addToCart(userId, productId, quantity) {
    const sql = `
        INSERT INTO cart_items (user_id, product_id, quantity) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`;

    await pool.query(sql, [userId, productId, quantity]);
    return { success: true };
}

async function getCartByUserId(userId) {
    // Join với bảng products để lấy tên, giá và ảnh
    const [rows] = await pool.query(
        `SELECT c.*, p.name, p.price, p.image_url 
         FROM cart_items c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.user_id = ?`, [userId]
    );
    return rows;
}

// Thay thế hàm updateCart cũ bằng updateCartItem (theo từng sản phẩm)
async function updateCartItem(userId, productId, quantity) {
    await pool.query(
        "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
        [quantity, userId, productId]
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
