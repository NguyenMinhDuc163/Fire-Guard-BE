const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Route đăng ký
router.post('/api/v1/auth/register', authController.registerUser);

// Route đăng nhập
router.post('/api/v1/auth/login', authController.loginUser);


// Route đổi mật khẩu
router.post('/api/v1/auth/change_password', authController.changePassword);

module.exports = router;
