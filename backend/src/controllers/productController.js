const productService = require("../services/productService");

exports.getAllProducts = async (req, res, next) => {
    try {
        const { q, brand, category, gender, minPrice, maxPrice, sort, page, limit } = req.query;

        const { rows, pagination } = await productService.list({
            q,
            brand,
            category,
            gender,
            minPrice,
            maxPrice,
            sort,
            page,
            limit,
        });

        res.json({ data: rows, pagination });
    } catch (err) {
        next(err);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const product = await productService.findById(id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (err) {
        next(err);
    }
};

exports.getSaleProducts = async (req, res, next) => {
    try {
        const rows = await productService.listSale();
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const created = await productService.create(req.body || {});
        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const existing = await productService.findById(id);
        if (!existing) return res.status(404).json({ message: "Product not found" });

        const updated = await productService.update(id, req.body || {});
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const ok = await productService.remove(id);

        if (!ok) return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted" });
    } catch (err) {
        next(err);
    }
};