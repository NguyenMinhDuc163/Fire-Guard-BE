const UserModel = require('../models/user.model');
const { createResponse } = require('../utils/responseHelper');
const { validateRegisterData, validateLoginData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Đăng ký người dùng
exports.registerUser = async (req, res) => {
    const { error } = validateRegisterData(req.body);
    if (error) {
        return res.status(400).json(createResponse('fail', error.details[0].message, 400));
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await UserModel.register({ ...req.body, password: hashedPassword });

        res.status(201).json(createResponse('success', 'Người dùng đã được đăng ký thành công.', 201, [newUser]));
    } catch (err) {
        res.status(500).json(createResponse('fail', 'Lỗi khi đăng ký người dùng.', 500, [], err.message));
    }
};

// Đăng nhập người dùng
exports.loginUser = async (req, res) => {
    const { error } = validateLoginData(req.body);
    if (error) {
        return res.status(400).json(createResponse('fail', error.details[0].message, 400));
    }

    try {
        const user = await UserModel.findByEmail(req.body.email);
        if (!user) {
            return res.status(404).json(createResponse('fail', 'Người dùng không tồn tại.', 404));
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json(createResponse('fail', 'Mật khẩu không chính xác.', 401));
        }

        // Tạo JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Tạo mảng các đối tượng chứa thông tin cần thiết
        const responseData = [
            { key: 'token', value: token },
            { key: 'user', value: { id: user.id, username: user.username, email: user.email } }
        ];

        res.status(200).json(createResponse('success', 'Đăng nhập thành công.', 200, responseData));
    } catch (err) {
        res.status(500).json(createResponse('fail', 'Lỗi khi đăng nhập.', 500, [], err.message));
    }
};

