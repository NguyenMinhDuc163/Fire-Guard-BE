const FamilyNotificationModel = require('../models/familyNotification.model');

const notifyFamilyMember = async (data) => {
    // Lưu thông báo vào cơ sở dữ liệu
    await FamilyNotificationModel.save(data);

    // Gửi thông báo đến người thân (giả lập)
    console.log('Thông báo đã gửi đến người thân:', data);
};

module.exports = {
    notifyFamilyMember,
};
