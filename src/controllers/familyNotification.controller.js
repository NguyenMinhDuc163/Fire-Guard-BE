const { notifyFamilyMember } = require('../services/familyNotification.service');
const { validateFamilyNotificationData } = require('../utils/validation');

exports.notifyFamilyMember = async (req, res) => {
    const { error } = validateFamilyNotificationData(req.body);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.details[0].message,
        });
    }

    try {
        await notifyFamilyMember(req.body);
        res.status(200).json({
            status: 'success',
            message: 'Thông báo đã được gửi đến người thân.',
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Lỗi khi gửi thông báo.',
            error: err.message,
        });
    }
};
