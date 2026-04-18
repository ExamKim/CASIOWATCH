const path = require("path");
const { readJson } = require("../utils/fileDb");
const e = require("express");

const filePath = path.join(__dirname, "../data/products.json");


// lấy tất cả sản phẩm
exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await readJson(filePath);
        res.json(products);
    } catch (err) {
        next(err);
    }
};

// lấy sản phẩm theo id
exports.getProductById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const products = await readJson(filePath);

        const product = products.find(p => p.id === id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        next(err);
    }
};

exports.getSaleProducts = async (req, res, next) => {
    try {
        const products = await readJson(filePath);
        const saleProducts = products.filter(p => p.salePrice < p.price);
        res.json(saleProducts);
    } catch (err) {
        next(err);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const products = await readJson(filePath);
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            ...req.body
        };
        products.push(newProduct);
        await writeJson(filePath, products);
        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const products = await readJson(filePath);
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            return res.status(404).json({ message: "Product not found" });
        }
        products[index] = { ...products[index], ...req.body };
        await writeJson(filePath, products);
        res.json(products[index]);
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const products = await readJson(filePath);
        const updatedProducts = products.filter(p => p.id !== id);
        await writeJson(filePath, updatedProducts);
        res.json({ message: "Product deleted" });
    }
    catch (err) {
        next(err);
    }
};

