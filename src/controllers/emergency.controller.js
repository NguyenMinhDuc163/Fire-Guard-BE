const { callFireDepartment } = require('../services/emergency.service');
const { validateEmergencyData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');

const lastFireDepartmentCall = {}; // Lưu timestamp của mỗi lần gọi theo vị trí

exports.callFireDepartment = async (req, res) => {
    const { error } = validateEmergencyData(req.body);
    if (error) {
        return res.status(400).json(
            createResponse('fail', error.details[0].message, 400, [], error.details[0].message)
        );
    }

    const { location, phone_number } = req.body; // Lấy phone_number từ request nếu có
    const now = Date.now(); // Lấy timestamp hiện tại
    const lastCall = lastFireDepartmentCall[location] || 0; // Kiểm tra lần gọi cuối cho địa điểm này

    console.log(`Last call for ${location}: ${lastCall}, Now: ${now}, Diff: ${now - lastCall}`);

    // Kiểm tra nếu chưa đủ 5 phút (300000ms)
    if (now - lastCall < 300000) {
        return res.status(429).json(
            createResponse('fail', 'Vui lòng đợi 5 phút trước khi gửi thông báo cứu hỏa tiếp theo.', 429, [])
        );
    }

    try {
        // Gọi lực lượng cứu hỏa với số điện thoại truyền vào hoặc lấy từ .env
        await callFireDepartment(req.body, phone_number || process.env.FIRE_DEPARTMENT_PHONE);

        // Cập nhật timestamp cho địa điểm này
        lastFireDepartmentCall[location] = now;

        res.status(200).json(
            createResponse('success', 'Lực lượng cứu hỏa đã được thông báo.', 200, [])
        );
    } catch (err) {
        res.status(500).json(
            createResponse('fail', 'Lỗi hệ thống.', 500, [], err.message)
        );
    }
};
