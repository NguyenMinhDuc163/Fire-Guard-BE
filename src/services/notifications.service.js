const axios = require('axios');
const pool = require('../configs/db.config');
const { getSavedAccessToken } = require('../configs/token.service');
const NotificationModel = require('../models/notification.model');

// Hàm gửi thông báo tới tất cả người dùng và ghi log vào DB
const sendNotificationToAllUsers = async (title, body) => {
    try {
        const result = await pool.query('SELECT id, token_fcm FROM users WHERE token_fcm IS NOT NULL');
        const users = result.rows;

        if (users.length === 0) {
            throw new Error('Không tìm thấy người dùng nào có token FCM hợp lệ.');
        }

        const accessToken = await getSavedAccessToken();

        const promises = users.map(user =>
            axios.post(
                'https://fcm.googleapis.com/v1/projects/fire-guard-5a3b2/messages:send',
                {
                    message: {
                        token: user.token_fcm,
                        notification: { title, body },
                        android: {
                            notification: { channel_id: 'fire_alarm_channel', sound: 'default' },
                        },
                    },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            ).then(async (response) => {
                // Lưu log thành công vào database
                await NotificationModel.save({
                    user_id: user.id,
                    title,
                    body,
                    fcm_token: user.token_fcm,
                    status: 'success',
                    message: 'Thông báo đã được gửi thành công.'
                });
                return response;
            }).catch(async (error) => {
                // Lưu log thất bại vào database
                await NotificationModel.save({
                    user_id: user.id,
                    title,
                    body,
                    fcm_token: user.token_fcm,
                    status: 'fail',
                    message: error.message
                });
                throw error;
            })
        );

        // Chờ tất cả yêu cầu hoàn tất
        const results = await Promise.allSettled(promises);

        results.forEach((result, index) => {
            const userToken = users[index].token_fcm;
            if (result.status === 'fulfilled') {
                console.log(`Gửi thông báo tới user ${userToken} thành công.`);
            } else {
                console.error(`Lỗi gửi thông báo tới user ${userToken}:`, result.reason.message);
            }
        });
8
        return results;
    } catch (error) {
        console.error('Lỗi khi gửi thông báo:', error.message);
        throw error;
    }
};

module.exports = { sendNotificationToAllUsers };
