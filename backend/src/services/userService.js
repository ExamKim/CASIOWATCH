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

async function updateProfile(id, { username, phone, address }) {
    const sets = [];
    const params = [];

    if (username !== undefined) {
        sets.push("username = ?");
        params.push(username);
    }
    if (phone !== undefined) {
        sets.push("phone = ?");
        params.push(phone);
    }
    if (address !== undefined) {
        sets.push("address = ?");
        params.push(address);
    }

    if (sets.length === 0) return await findById(id);

    params.push(id);
    await pool.query(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, params);
    return await findById(id);
}

module.exports = { findByEmail, findById, createUser, updateProfile };