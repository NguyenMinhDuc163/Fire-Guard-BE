const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../controllers/auth.controller');

// Route đăng ký
router.post('/api/v1/auth/register', authController.registerUser);

// Route đăng nhập
router.post('/api/v1/auth/login', authController.loginUser);


// Route đổi mật khẩu
router.post('/api/v1/auth/change_password', authController.changePassword);

// API yêu cầu gửi email reset mật khẩu
router.post('/api/v1/auth/forgot_password', authController.requestForgotPassword);

// API đặt lại mật khẩu (quên mật khẩu)
router.post('/api/v1/auth/reset_password', authController.resetPassword);

// web
router.get('/reset_password_confirm', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'reset-password.html')); // Đường dẫn tới file HTML
});

module.exports = router;
