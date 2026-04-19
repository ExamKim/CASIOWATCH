const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authMiddleware;