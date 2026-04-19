const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Dang ky
router.post("/register", authController.register);
// Dang nhap
router.post("/login", authController.login);

module.exports = router;
