// services/notificationsService.js
const notificationsModel = require('../models/notificationsModel');

exports.sendNotification = async (data) => {
    // Xử lý logic gửi thông báo (nếu cần)
    const insertedData = await notificationsModel.insertNotification(data);
    return insertedData;
};
