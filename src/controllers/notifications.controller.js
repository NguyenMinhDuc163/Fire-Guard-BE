const { sendNotification } = require('../services/notifications.service');
const { validateNotificationData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); // Import helper để tạo phản hồi chuẩn

exports.sendNotification = async (req, res) => {
    // Validate dữ liệu đầu vào từ request body
    const { error } = validateNotificationData(req.body);
    if (error) {
        // Trả về phản hồi lỗi với mã 400 và thông tin lỗi chi tiết
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        // Gửi thông báo
        await sendNotification(req.body);

        // Trả về phản hồi thành công với mã 200
        res.status(200).json(createResponse('success', 'Thông báo đã được gửi tới người dùng.', 200, []));
    } catch (err) {
        // Trả về phản hồi lỗi với mã 500 nếu có lỗi hệ thống
        res.status(500).json(createResponse('fail', 'Lỗi khi gửi thông báo.', 500, [], err.message));
    }
};
