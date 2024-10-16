const { notifyFamilyMember } = require('../services/familyNotification.service');
const { validateFamilyNotificationData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); 
exports.notifyFamilyMember = async (req, res) => {
        const { error } = validateFamilyNotificationData(req.body);
    if (error) {
                return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
                await notifyFamilyMember(req.body);

                res.status(200).json(createResponse('success', 'Thông báo đã được gửi đến người thân.', 200, []));
    } catch (err) {
                res.status(500).json(createResponse('fail', 'Lỗi khi gửi thông báo.', 500, [], err.message));
    }
};
