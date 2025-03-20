const { sendNotificationToFamilyMembers } = require('../services/notifications.service');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');

exports.sendNotification = async (req, res) => {
    const { familyMemberId, title, body } = req.body;

    try {
        logger.info('Bắt đầu gửi thông báo.', { meta: { familyMemberId, title, body } });

        // Gửi thông báo tới danh sách người thân
        const result = await sendNotificationToFamilyMembers(familyMemberId, title, body);

        // Chỉ phản hồi kết quả thành công hoặc lỗi đơn giản
        const successful = result.filter(r => r.status === 'fulfilled').length;
        const failed = result.length - successful;

        logger.info(`Thông báo đã được gửi tới ${successful} người thân. Có ${failed} người bị lỗi.`, { meta: { successful, failed } });

        res.status(200).json(
            createResponse(
                'success',
                `Đã gửi thông báo tới ${successful} người thân. Có ${failed} người bị lỗi.`,
                200
            )
        );
    } catch (error) {
        logger.error(`Lỗi khi gửi thông báo: ${error.message}`, { meta: { familyMemberId, title, body, error } });
        res.status(200).json(
            createResponse('fail', 'Không thể gửi thông báo.', 500, [], error.message)
        );
    }
};
