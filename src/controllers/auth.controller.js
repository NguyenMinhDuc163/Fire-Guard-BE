const UserModel = require('../models/user.model');
const { createResponse } = require('../utils/responseHelper');
const { validateRegisterData, validateLoginData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

// Đăng ký người dùng
exports.registerUser = async (req, res) => {
    const { error } = validateRegisterData(req.body);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
        return res.status(400).json(createResponse('fail', error.details[0].message, 400));
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await UserModel.register({ ...req.body, password: hashedPassword });

        logger.info('Người dùng đã được đăng ký thành công.', { meta: { userId: newUser.id } });

        res.status(201).json(createResponse('success', 'Người dùng đã được đăng ký thành công.', 201, [newUser]));
    } catch (err) {
        logger.error(`Lỗi khi đăng ký người dùng: ${err.message}`, { meta: { request: req.body, error: err } });
        res.status(500).json(createResponse('fail', 'Lỗi khi đăng ký người dùng.', 500, [], err.message));
    }
};

// Đăng nhập người dùng
exports.loginUser = async (req, res) => {
    const { error } = validateLoginData(req.body);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [])); // Sửa data thành []
    }

    try {
        const user = await UserModel.findByEmail(req.body.email);
        if (!user) {
            logger.warn('Người dùng không tồn tại.', { meta: { email: req.body.email } });
            return res.status(404).json(createResponse('fail', 'Người dùng không tồn tại.', 404, [])); // Sửa data thành []
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            logger.warn('Mật khẩu không chính xác.', { meta: { email: req.body.email } });
            return res.status(401).json(createResponse('fail', 'Mật khẩu không chính xác.', 401, [])); // Sửa data thành []
        }

        // Tạo JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const responseData = [
            { key: 'token', value: token },
            { key: 'user', value: { id: user.id, username: user.username, email: user.email } }
        ];

        logger.info('Đăng nhập thành công.', { meta: { userId: user.id, email: user.email } });

        res.status(200).json(createResponse('success', 'Đăng nhập thành công.', 200, responseData));
    } catch (err) {
        logger.error(`Lỗi khi đăng nhập: ${err.message}`, { meta: { request: req.body, error: err } });
        res.status(500).json(createResponse('fail', 'Lỗi khi đăng nhập.', 500, [], err.message)); // Sửa data thành []
    }
};

// Đổi mật khẩu người dùng
exports.changePassword = async (req, res) => {
    const { id, oldPassword, newPassword } = req.body;

    // Validate input
    if (!id || !oldPassword || !newPassword) {
        logger.error('Validation Error: Missing required fields.', { meta: { request: req.body } });
        return res.status(400).json(createResponse('fail', 'Thiếu thông tin cần thiết.', 400, []));
    }

    try {
        // Tìm người dùng theo id
        const user = await UserModel.findById(id);
        if (!user) {
            logger.warn('Người dùng không tồn tại.', { meta: { id } });
            return res.status(404).json(createResponse('fail', 'Người dùng không tồn tại.', 404, []));
        }

        // Xác thực mật khẩu cũ
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            logger.warn('Mật khẩu cũ không chính xác.', { meta: { id } });
            return res.status(401).json(createResponse('fail', 'Mật khẩu cũ không chính xác.', 401, []));
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu
        await UserModel.updatePassword(id, hashedPassword);

        logger.info('Đổi mật khẩu thành công.', { meta: { userId: id } });
        res.status(200).json(createResponse('success', 'Đổi mật khẩu thành công.', 200, []));
    } catch (err) {
        logger.error(`Lỗi khi đổi mật khẩu: ${err.message}`, { meta: { request: req.body, error: err } });
        res.status(500).json(createResponse('fail', 'Lỗi khi đổi mật khẩu.', 500, [], err.message));
    }
};



