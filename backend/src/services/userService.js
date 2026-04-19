const { pool } = require("../config/db");

async function findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    return rows[0] || null;
}

async function findById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
    return rows[0] || null;
}

async function createUser({ username, email, passwordHash, role = "user", phone = null, address = null }) {
    const [result] = await pool.query(
        `INSERT INTO users (username, email, password_hash, role, phone, address)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [username, email, passwordHash, role, phone, address]
    );
    return await findById(result.insertId);
}

module.exports = { findByEmail, findById, createUser };