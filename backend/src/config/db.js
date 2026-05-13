const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function testDbConnection() {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("MariaDB connected");
}

async function ensureOrderShippingColumns() {
    const conn = await pool.getConnection();

    try {
        const [rows] = await conn.query(
            `SELECT COLUMN_NAME
             FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = 'orders'
                  AND COLUMN_NAME IN ('address', 'phone', 'note', 'recipient')`
        );

        const existingColumns = new Set(rows.map((row) => row.COLUMN_NAME));

        if (!existingColumns.has("address")) {
            await conn.query("ALTER TABLE orders ADD COLUMN address VARCHAR(255) NULL");
        }

        if (!existingColumns.has("phone")) {
            await conn.query("ALTER TABLE orders ADD COLUMN phone VARCHAR(30) NULL");
        }

        if (!existingColumns.has("note")) {
            await conn.query("ALTER TABLE orders ADD COLUMN note TEXT NULL");
        }

        if (!existingColumns.has("recipient")) {
            await conn.query("ALTER TABLE orders ADD COLUMN recipient VARCHAR(255) NULL");
        }
    } finally {
        conn.release();
    }
}

module.exports = { pool, testDbConnection, ensureOrderShippingColumns };