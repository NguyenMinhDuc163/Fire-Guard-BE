const { logger } = require('../utils/logger');
const { notifyFamilyMember } = require('../services/familyNotification.service');
const { validateFamilyNotificationData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');
const lastCallTimestamps = {}; // Lưu timestamp cho từng số điện thoại

exports.notifyFamilyMember = async (req, res) => {
    // Validate dữ liệu request
    const { error } = validateFamilyNotificationData(req.body);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`);
        return res.status(400).json(
            createResponse('fail', error.details[0].message, 400, [], error.details[0].message)
        );
    }

    // Lấy số điện thoại từ request hoặc từ biến môi trường
    const PHONE_NUMBER = req.body.phone_number || process.env.PHONE_NUMBER;
    const now = Date.now();
    const lastCall = lastCallTimestamps[PHONE_NUMBER] || 0;

    logger.info(`Last call: ${lastCall}, Now: ${now}, Diff: ${now - lastCall}`);

    // Kiểm tra nếu chưa đủ 5 phút (300000ms) từ lần gọi cuối
    if (now - lastCall < 300000) {
        logger.warn('Gửi thông báo quá nhanh, vui lòng đợi 5 phút.');
        return res.status(429).json(
            createResponse('fail', 'Vui lòng đợi 5 phút trước khi gửi thông báo tiếp theo.', 429, [])
        );
    }

    try {
        // Gửi thông báo
        await notifyFamilyMember(req.body, PHONE_NUMBER);

        // Cập nhật timestamp cho số điện thoại này
        lastCallTimestamps[PHONE_NUMBER] = now;

        logger.info('Thông báo đã được gửi đến người thân.');

        return res.status(200).json(
            createResponse('success', 'Thông báo đã được gửi đến người thân.', 200, [])
        );
    } catch (err) {
        logger.error(`Lỗi khi gửi thông báo: ${err.message}`);
        return res.status(500).json(
            createResponse('fail', 'Lỗi khi gửi thông báo.', 500, [], err.message)
        );
    }
};
