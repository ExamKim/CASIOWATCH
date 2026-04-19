const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

const authMiddleware = require("../middlewares/authMiddleware");
const userService = require("../services/userService");

router.get("/me", authMiddleware, async (req, res, next) => {
    try {
        const user = await userService.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const safeUser = { ...user };
        delete safeUser.password_hash;
        res.json({ user: safeUser });
    } catch (err) {
        next(err);
    }
});

module.exports = router;