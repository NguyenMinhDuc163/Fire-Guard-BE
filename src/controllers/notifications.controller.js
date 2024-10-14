const { sendNotification } = require('../services/notifications.service');
const { validateNotificationData } = require('../utils/validation');

exports.sendNotification = async (req, res) => {
    const { error } = validateNotificationData(req.body);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.details[0].message,
        });
    }

    try {
        await sendNotification(req.body);
        res.status(200).json({
            status: 'success',
            message: 'Thông báo đã được gửi tới người dùng.',
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Lỗi khi gửi thông báo.',
            error: err.message,
        });
    }
};
