const { sendNotification } = require('../services/notifications.service');
const { validateNotificationData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); 
exports.sendNotification = async (req, res) => {
        const { error } = validateNotificationData(req.body);
    if (error) {
                return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
                await sendNotification(req.body);

                res.status(200).json(createResponse('success', 'Thông báo đã được gửi tới người dùng.', 200, []));
    } catch (err) {
                res.status(500).json(createResponse('fail', 'Lỗi khi gửi thông báo.', 500, [], err.message));
    }
};
