const { sendNotificationToAllUsers } = require('../services/notifications.service');
const { createResponse } = require('../utils/responseHelper');

exports.sendNotification = async (req, res) => {
    const { title, body } = req.body;

    try {
        console.log('Bắt đầu gửi thông báo với:', { title, body });

        // Thực hiện gửi thông báo tới tất cả người dùng
        const result = await sendNotificationToAllUsers(title, body);

        // Chỉ phản hồi kết quả thành công hoặc lỗi đơn giản
        const successful = result.filter(r => r.status === 'fulfilled').length;
        const failed = result.length - successful;

        res.status(200).json(
            createResponse(
                'success',
                `Đã gửi thông báo tới ${successful} người dùng. Có ${failed} người dùng bị lỗi.`,
                200
            )
        );
    } catch (error) {
        console.error('Lỗi khi gửi thông báo:', error.message);
        res.status(500).json(
            createResponse('fail', 'Không thể gửi thông báo.', 500, [], error.message)
        );
    }
};
