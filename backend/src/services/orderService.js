const { pool } = require("../config/db");

async function createOrderFromCart(userId) {
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

        if (cartItems.length === 0) {
            const err = new Error("Cart is empty");
            err.status = 400;
            throw err;
        }

        const totalPrice = cartItems.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0
        );

        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'pending')",
            [userId, totalPrice]
        );

        const orderId = orderResult.insertId;
        const orderItemValues = cartItems.map((item) => [
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

        await connection.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);

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

module.exports = {
    createOrderFromCart,
    getMyOrders,
    getOrderDetail,
};
