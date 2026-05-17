const express = require('express');
const router = express.Router();
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
        res.json(safeUser);
    } catch (err) {
        next(err);
    }
});

router.put("/profile", authMiddleware, async (req, res, next) => {
    try {
        const { username, phone, address } = req.body;
        const updated = await userService.updateProfile(req.user.id, { username, phone, address });
        const safeUser = { ...updated };
        delete safeUser.password_hash;
        res.json(safeUser);
    } catch (err) {
        next(err);
    }
});

const bcrypt = require("bcryptjs");

router.put("/change-password", authMiddleware, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Mật khẩu hiện tại và mật khẩu mới là bắt buộc" });
        }
        
        const user = await userService.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        
        if (!user.password_hash) {
            return res.status(400).json({ message: "Tài khoản đăng nhập bằng OAuth. Không thể đổi mật khẩu." });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu hiện tại không chính xác" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await userService.updatePassword(req.user.id, hashed);

        res.json({ message: "Đổi mật khẩu thành công" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;