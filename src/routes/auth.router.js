const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Route đăng ký
router.post('/api/v1/auth/register', authController.registerUser);

// Route đăng nhập
router.post('/api/v1/auth/login', authController.loginUser);

module.exports = router;
