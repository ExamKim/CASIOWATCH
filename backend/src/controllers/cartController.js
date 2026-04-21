const cartService = require("../services/cartService");

exports.getCart = async (req, res) => {
    const userId = req.user.id;
    const cart = await cartService.getCartByUserId(userId);
    res.json(cart);
};

exports.addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "productId and quantity > 0 are required" });
    }
    const updatedCart = await cartService.addToCart(userId, productId, quantity);
    res.json(updatedCart);
}

exports.updateCartItem = async (req, res) => {
    const userId = req.user.id;
    const productId = Number(req.params.productId);
    const { quantity } = req.body;
    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "productId and quantity > 0 are required" });
    }
    const updatedCart = await cartService.updateCartItem(userId, productId, quantity);
    res.json(updatedCart);
}

exports.removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const productId = Number(req.params.productId);
    if (!productId) {
        return res.status(400).json({ message: "productId is required" });
    }
    const updatedCart = await cartService.removeFromCart(userId, productId);
    res.json(updatedCart);
}

