const { callFireDepartment } = require('../services/emergency.service');
const { validateEmergencyData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); // Import helper để tạo response chuẩn

exports.callFireDepartment = async (req, res) => {
    // Validate dữ liệu từ request
    const { error } = validateEmergencyData(req.body);
    if (error) {
        // Trả về phản hồi lỗi với code 400
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        // Gọi service để thông báo cho lực lượng cứu hỏa
        await callFireDepartment(req.body);

        // Trả về phản hồi thành công với code 200
        res.status(200).json(createResponse('success', 'Lực lượng cứu hỏa đã được thông báo.', 200, []));
    } catch (err) {
        // Trả về phản hồi lỗi với code 500
        res.status(500).json(createResponse('fail', 'Lỗi hệ thống.', 500, [], err.message));
    }
};
