const UserModel = require('../models/user.model');
const { createResponse } = require('../utils/responseHelper');
const { validateRegisterData, validateLoginData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');
const { sendResetEmail } = require('../services/email.service');
// Đăng ký người dùng
exports.registerUser = async (req, res) => {
    const { error } = validateRegisterData(req.body);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
        return res.status(400).json(createResponse('fail', error.details[0].message, 400));
    }

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await UserModel.findByEmail(req.body.email);

        if (existingUser) {
            return res.status(400).json(createResponse('fail', 'Email đã được sử dụng.', 400));
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Thêm mới người dùng
        const newUser = await UserModel.register({ ...req.body, password: hashedPassword });

        logger.info('Người dùng đã được đăng ký thành công.', { meta: { userId: newUser.id } });

        return res.status(201).json(createResponse('success', 'Người dùng đã được đăng ký thành công.', 201, [newUser]));
    } catch (err) {
        logger.error(`Lỗi khi đăng ký người dùng: ${err.message}`, { meta: { request: req.body, error: err } });
        return res.status(500).json(createResponse('fail', 'Lỗi khi đăng ký người dùng.', 500, [], err.message));
    }
};
// update thong tin nguoi dung
exports.updateUserInfo = async (req, res) => {
    const { id, email, phone_number, click_send_name, click_send_key } = req.body;

    // Kiểm tra xem ID có được truyền hay không
    if (!id) {
        return res.status(400).json(createResponse('fail', 'ID người dùng là bắt buộc.', 400));
    }

    try {
        // Kiểm tra xem người dùng có tồn tại không
        const existingUser = await UserModel.findById(id);

        if (!existingUser) {
            return res.status(404).json(createResponse('fail', 'Người dùng không tồn tại.', 404));
        }

        // Cập nhật thông tin người dùng
        const updatedUser = await UserModel.updateUser(id, {
            email,
            phone_number,
            click_send_name,
            click_send_key
        });

        return res.status(200).json(createResponse('success', 'Thông tin người dùng đã được cập nhật thành công.', 200, [updatedUser]));
    } catch (err) {
        logger.error(`Lỗi khi cập nhật thông tin người dùng: ${err.message}`, { meta: { request: req.body, error: err } });
        return res.status(500).json(createResponse('fail', 'Lỗi khi cập nhật thông tin người dùng.', 500, [], err.message));
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

exports.requestForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Kiểm tra email có tồn tại không
        const user = await UserModel.findByEmail(email);
        if (!user) {
            logger.warn(`Email không tồn tại: ${email}`);
            return res.status(404).json(createResponse('fail', 'Email không tồn tại.', 404));
        }

        // Tạo token reset mật khẩu (hết hạn sau 15 phút)
        const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Gửi email reset mật khẩu
        // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const resetLink = `${process.env.FRONTEND_URL}?token=${resetToken}`;
        await sendResetEmail(email, resetLink);

        logger.info(`Email reset mật khẩu đã được gửi tới: ${email}`);
        res.status(200).json(createResponse('success', 'Email reset mật khẩu đã được gửi.', 200, []));
    } catch (err) {
        logger.error(`Lỗi khi yêu cầu reset mật khẩu: ${err.message}`);
        res.status(500).json(createResponse('fail', 'Lỗi server.', 500));
    }
};

// API đặt lại mật khẩu (quên mật khẩu)
exports.resetPassword = async (req, res) => {
    // Lấy token từ header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Tách 'Bearer token'

    const { newPassword } = req.body; // Chỉ lấy newPassword từ body

    // Validate dữ liệu đầu vào
    if (!token || !newPassword) {
        logger.error('Validation Error: Missing required fields.', { meta: { request: req.body } });
        return res.status(400).json(createResponse('fail', 'Thiếu thông tin cần thiết.', 400));
    }

    try {
        // Xác minh token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.info('Token đã được xác minh.', { meta: { decoded } });

        // Kiểm tra người dùng tồn tại
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            logger.warn('Người dùng không tồn tại.', { meta: { userId: decoded.userId } });
            return res.status(404).json(createResponse('fail', 'Người dùng không tồn tại.', 404));
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu
        await UserModel.updatePassword(user.id, hashedPassword);

        logger.info('Mật khẩu đã được cập nhật thành công.', { meta: { userId: user.id } });
        res.status(200).json(createResponse('success', 'Mật khẩu đã được cập nhật thành công.', 200));
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            logger.error('Token không hợp lệ.', { meta: { error: err.message } });
            return res.status(401).json(createResponse('fail', 'Token không hợp lệ.', 401));
        }
        if (err.name === 'TokenExpiredError') {
            logger.error('Token đã hết hạn.', { meta: { error: err.message } });
            return res.status(401).json(createResponse('fail', 'Token đã hết hạn.', 401));
        }
        logger.error(`Lỗi khi đặt lại mật khẩu: ${err.message}`, { meta: { request: req.body } });
        res.status(500).json(createResponse('fail', 'Lỗi server.', 500, null, err.message));
    }
};

