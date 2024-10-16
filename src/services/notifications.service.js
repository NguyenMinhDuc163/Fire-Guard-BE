const NotificationModel = require('../models/notification.model');

const sendNotification = async (data) => {
        await NotificationModel.save(data);

        
    };

module.exports = {
    sendNotification,
};



