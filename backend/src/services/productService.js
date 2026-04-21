const { pool } = require("../config/db");

function toNum(v) {
    if (v == null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function orderByFromSort(sort) {
    const map = {
        price_asc: "price ASC",
        price_desc: "price DESC",
        name_asc: "name ASC",
        name_desc: "name DESC",
    };
    return map[sort] || "id DESC";
}

async function list({ q, brand, minPrice, maxPrice, sort, page = 1, limit = 12 }) {
    const _page = Math.max(1, Number(page) || 1);
    const _limit = Math.max(1, Math.min(100, Number(limit) || 12));
    const offset = (_page - 1) * _limit;

    const where = [];
    const params = [];

    if (q && String(q).trim() !== "") {
        where.push("name LIKE ?");
        params.push(`%${String(q).trim()}%`);
    }

    if (brand && String(brand).trim() !== "") {
        where.push("brand = ?");
        params.push(String(brand).trim());
    }

    const min = toNum(minPrice);
    const max = toNum(maxPrice);
    if (min != null) {
        where.push("price >= ?");
        params.push(min);
    }
    if (max != null) {
        where.push("price <= ?");
        params.push(max);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const orderBy = orderByFromSort(sort);

    // total
    const [countRows] = await pool.query(
        `SELECT COUNT(*) as total FROM products ${whereSql}`,
        params
    );
    const total = Number(countRows[0]?.total || 0);
    const totalPages = total === 0 ? 0 : Math.ceil(total / _limit);

    // data
    const [rows] = await pool.query(
        `SELECT * FROM products ${whereSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
        [...params, _limit, offset]
    );

    return { rows, pagination: { page: _page, limit: _limit, total, totalPages } };
}

async function findById(id) {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
    return rows[0] || null;
}

async function create(payload) {
    const {
        name,
        category,
        gender,
        brand = null,
        price,
        sale_price = null,
        salePrice = null,
        stock = 0,
        status = "active",
    } = payload;

    const finalSalePrice = sale_price != null ? sale_price : salePrice;

    const [result] = await pool.query(
        `INSERT INTO products (name, category, gender, brand, price, sale_price, stock, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, category, gender, brand, price, finalSalePrice, stock, status]
    );
    return await findById(result.insertId);
}

async function update(id, payload) {
    const allowed = ["name", "category", "gender", "brand", "price", "sale_price", "stock", "status"];
    const normalized = { ...payload };
    if (normalized.sale_price == null && normalized.salePrice != null) {
        normalized.sale_price = normalized.salePrice;
    }

    const sets = [];
    const params = [];

    for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(normalized, key)) {
            sets.push(`${key} = ?`);
            params.push(normalized[key]);
        }
    }

    if (sets.length === 0) return await findById(id);

    params.push(id);
    await pool.query(`UPDATE products SET ${sets.join(", ")} WHERE id = ?`, params);
    return await findById(id);
}

async function remove(id) {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
    return result.affectedRows > 0;
}

async function listSale() {
    const [rows] = await pool.query(
        "SELECT * FROM products WHERE sale_price IS NOT NULL AND sale_price < price ORDER BY id DESC"
    );
    return rows;
}

module.exports = { list, findById, create, update, remove, listSale };