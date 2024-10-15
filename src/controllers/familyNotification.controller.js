const { notifyFamilyMember } = require('../services/familyNotification.service');
const { validateFamilyNotificationData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); // Import helper để tạo response chuẩn

exports.notifyFamilyMember = async (req, res) => {
    // Validate dữ liệu từ request
    const { error } = validateFamilyNotificationData(req.body);
    if (error) {
        // Trả về phản hồi lỗi với code 400
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        // Gửi thông báo đến người thân
        await notifyFamilyMember(req.body);

        // Trả về phản hồi thành công với code 200
        res.status(200).json(createResponse('success', 'Thông báo đã được gửi đến người thân.', 200, []));
    } catch (err) {
        // Trả về phản hồi lỗi với code 500
        res.status(500).json(createResponse('fail', 'Lỗi khi gửi thông báo.', 500, [], err.message));
    }
};
