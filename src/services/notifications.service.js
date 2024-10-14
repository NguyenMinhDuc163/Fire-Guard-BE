const NotificationModel = require('../models/notification.model');

const sendNotification = async (data) => {
    // Thực hiện lưu thông báo vào cơ sở dữ liệu
    await NotificationModel.save(data);

    // Giả sử bạn muốn tích hợp với hệ thống gửi thông báo thực tế (Firebase, OneSignal, v.v.)
    // Bạn có thể thêm logic gửi thông báo tại đây.

    // Ví dụ: await pushNotificationService.send(data.user_id, data.message);
};

module.exports = {
    sendNotification,
};


// TODO câu hình firebase

// const NotificationModel = require('../models/notification.model');
// const admin = require('../configs/firebase.config');
//
// const sendNotification = async (data) => {
//     // Lưu thông báo vào cơ sở dữ liệu
//     await NotificationModel.save(data);
//
//     // Gửi thông báo qua FCM
//     const message = {
//         notification: {
//             title: 'Thông báo mới',
//             body: data.message,
//         },
//         token: data.user_device_token, // Bạn cần lưu trữ và lấy token của thiết bị người dùng
//     };
//
//     await admin.messaging().send(message);
// };
//
// module.exports = {
//     sendNotification,
// };
