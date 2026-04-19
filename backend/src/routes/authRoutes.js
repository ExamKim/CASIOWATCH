const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController.js");

// Dang ky
router.post("/register", register);
// Dang nhap
router.post("/login", login);

module.exports = router;
