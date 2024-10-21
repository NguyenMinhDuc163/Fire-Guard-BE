const { notifyFamilyMember } = require('../services/familyNotification.service');
const { validateFamilyNotificationData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');
const lastCallTimestamps = {}; // Lưu timestamp cho từng số điện thoại

exports.notifyFamilyMember = async (req, res) => {
    const { error } = validateFamilyNotificationData(req.body);
    if (error) {
        return res.status(400).json(
            createResponse('fail', error.details[0].message, 400, [], error.details[0].message)
        );
    }

    // Lấy số điện thoại từ request hoặc từ biến môi trường
    const PHONE_NUMBER = req.body.phone_number || process.env.PHONE_NUMBER;
    const now = Date.now(); // Lấy timestamp hiện tại (milliseconds)
    const lastCall = lastCallTimestamps[PHONE_NUMBER] || 0; // Lấy lần gọi cuối cùng

    console.log(`Last call: ${lastCall}, Now: ${now}, Diff: ${now - lastCall}`);

    // Kiểm tra nếu chưa đủ 5 phút (300000ms) từ lần gọi cuối
    if (now - lastCall < 300000) {
        return res.status(429).json(
            createResponse('fail', 'Vui lòng đợi 5 phút trước khi gửi thông báo tiếp theo.', 429, [])
        );
    }

    try {
        await notifyFamilyMember(req.body, PHONE_NUMBER);

        // Cập nhật timestamp cho số điện thoại này
        lastCallTimestamps[PHONE_NUMBER] = now;

        res.status(200).json(
            createResponse('success', 'Thông báo đã được gửi đến người thân.', 200, [])
        );
    } catch (err) {
        res.status(500).json(
            createResponse('fail', 'Lỗi khi gửi thông báo.', 500, [], err.message)
        );
    }
};
