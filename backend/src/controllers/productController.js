const products = require("../data/products.json");

// GET /products
exports.getProducts = (req, res) => {
    let result = [...products];

    res.json(result);
};

// GET /products/:id
exports.getProductById = (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
};

exports.createProduct = (req, res) => {
    const { name, price, description } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required" });
    }
    const newProduct = {
        id: products.length + 1,
        name,
        price,
        description
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
};