const bcrypt = require("bcryptjs");
const userService = require("../services/userService");
const { signToken } = require("../utils/jwt");

// POST /auth/register

exports.register = async (req, res, next) => {
    try {
        const body = req.body || {};
        const { username, email, password, phone, address } = body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "username, email, password are required" });
        }

        const existing = await userService.findByEmail(email);
        if (existing) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const created = await userService.createUser({
            username,
            email,
            passwordHash: password_hash,
            role: "user",
            phone: phone || null,
            address: address || null,
        });

        // created có thể là object trả về từ DB
        const safeUser = { ...created };
        delete safeUser.password_hash;

        const token = signToken({ id: safeUser.id, role: safeUser.role });

        return res.status(201).json({ user: safeUser, token });
    } catch (err) {
        next(err);
    }
};

// POST /auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" });
        }

        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!user.password_hash) {
            return res.status(401).json({ message: "This account uses OAuth login. Please use Google or Facebook to sign in." });
        }

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const safeUser = { ...user };
        delete safeUser.password_hash;

        const token = signToken({ id: safeUser.id, role: safeUser.role });

        return res.json({ user: safeUser, token });
    } catch (err) {
        next(err);
    }
};