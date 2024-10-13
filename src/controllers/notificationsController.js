// controllers/notificationsController.js
const notificationsService = require('../services/notificationsService');

exports.sendNotification = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await notificationsService.sendNotification(data);
        res.status(200).json({
            status: 'success',
            data: result,
            message: 'Thông báo đã được gửi tới người dùng.',
        });
    } catch (error) {
        next(error);
    }
};
