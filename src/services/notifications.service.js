const axios = require('axios');
const pool = require('../configs/db.config');
const { getSavedAccessToken } = require('../configs/token.service');
const NotificationModel = require('../models/notification.model');

// Hàm gửi thông báo tới danh sách người thân của chủ sở hữu
const sendNotificationToFamilyMembers = async (ownerId, title, body) => {
    try {
        // Lấy danh sách người thân từ bảng family_notifications
        const result = await pool.query(
            `SELECT fn.family_member_id, u.token_fcm 
             FROM family_notifications fn
             JOIN users u ON fn.family_member_id = u.id
             WHERE fn.user_id = $1 AND u.token_fcm IS NOT NULL`,
            [ownerId]
        );
        const familyMembers = result.rows;

        if (familyMembers.length === 0) {
            throw new Error('Không tìm thấy người thân nào có token FCM hợp lệ.');
        }

        const accessToken = await getSavedAccessToken();

        const promises = familyMembers.map(member =>
            axios.post(
                'https://fcm.googleapis.com/v1/projects/fire-guard-5a3b2/messages:send',
                {
                    message: {
                        token: member.token_fcm,
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
                    user_id: member.family_member_id,
                    title,
                    body,
                    fcm_token: member.token_fcm,
                    status: 'success',
                    message: 'Thông báo đã được gửi thành công.'
                });
                return response;
            }).catch(async (error) => {
                // Lưu log thất bại vào database
                await NotificationModel.save({
                    user_id: member.family_member_id,
                    title,
                    body,
                    fcm_token: member.token_fcm,
                    status: 'fail',
                    message: error.message
                });
                throw error;
            })
        );

        // Chờ tất cả yêu cầu hoàn tất
        const results = await Promise.allSettled(promises);

        results.forEach((result, index) => {
            const userToken = familyMembers[index].token_fcm;
            if (result.status === 'fulfilled') {
                console.log(`Gửi thông báo tới user ${userToken} thành công.`);
            } else {
                console.error(`Lỗi gửi thông báo tới user ${userToken}:`, result.reason.message);
            }
        });

        return results;
    } catch (error) {
        console.error('Lỗi khi gửi thông báo:', error.message);
        throw error;
    }
};

module.exports = { sendNotificationToFamilyMembers };
