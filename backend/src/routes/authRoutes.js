const express = require("express");
const router = express.Router();
const passport = require('../config/passport');
const { register, login } = require("../controllers/authController.js");
const { oauthCallback } = require('../controllers/oauthController');

// Đăng ký
router.post("/register", register);
// Đăng nhập
router.post("/login", login);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), oauthCallback);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), oauthCallback);

module.exports = router;
