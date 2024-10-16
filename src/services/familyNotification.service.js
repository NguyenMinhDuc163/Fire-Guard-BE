const FamilyNotificationModel = require('../models/familyNotification.model');

const notifyFamilyMember = async (data) => {
        await FamilyNotificationModel.save(data);

        console.log('Thông báo đã gửi đến người thân:', data);
};

module.exports = {
    notifyFamilyMember,
};
