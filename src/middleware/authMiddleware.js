const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');
const {createResponse} = require("../utils/responseHelper");

const authenticateJWT = (req, res, next) => {
    const publicRoutes = ['/api/v1/auth/login', '/api/v1/auth/register']; // Các route không yêu cầu xác thực

    if (publicRoutes.includes(req.path)) {
        return next(); // Bỏ qua kiểm tra với route công khai
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        logger.warn(`Token không được cung cấp. Path: ${req.path}`, { meta: { headers: req.headers } });
        return res.status(200).json(createResponse('fail', 'Token không được cung cấp.', 401, [], err.message));

    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Xác thực token
        req.user = decoded; // Gắn thông tin người dùng vào request
        next();
    } catch (err) {
        logger.error(`Token không hợp lệ hoặc đã hết hạn. Path: ${req.path}`, { meta: { error: err } });
        return res.status(200).json(createResponse('fail', 'Token không hợp lệ hoặc đã hết hạn.', 403, [], err.message));


    }
};

module.exports = { authenticateJWT };
