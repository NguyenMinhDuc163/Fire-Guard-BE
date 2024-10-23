const { sendNotificationToAllUsers } = require('../services/notifications.service');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');

exports.sendNotification = async (req, res) => {
    const { title, body } = req.body;

    try {
        logger.info('Bắt đầu gửi thông báo.', { meta: { title, body } });

        // Thực hiện gửi thông báo tới tất cả người dùng
        const result = await sendNotificationToAllUsers(title, body);

        // Chỉ phản hồi kết quả thành công hoặc lỗi đơn giản
        const successful = result.filter(r => r.status === 'fulfilled').length;
        const failed = result.length - successful;

        logger.info(`Thông báo đã được gửi tới ${successful} người dùng. Có ${failed} người dùng bị lỗi.`, { meta: { successful, failed } });

        res.status(200).json(
            createResponse(
                'success',
                `Đã gửi thông báo tới ${successful} người dùng. Có ${failed} người dùng bị lỗi.`,
                200
            )
        );
    } catch (error) {
        logger.error(`Lỗi khi gửi thông báo: ${error.message}`, { meta: { title, body, error } });
        res.status(500).json(
            createResponse('fail', 'Không thể gửi thông báo.', 500, [], error.message)
        );
    }
};
