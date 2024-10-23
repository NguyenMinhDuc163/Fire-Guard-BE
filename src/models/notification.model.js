const pool = require('../configs/db.config');

class NotificationModel {
    static async save(data) {
        const query = `
            INSERT INTO notifications (user_id, title, body, fcm_token, status, message, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *;
        `;
        const values = [
            data.user_id,    // ID người dùng (có thể null nếu không có user_id)
            data.title,      // Tiêu đề của thông báo
            data.body,       // Nội dung của thông báo
            data.fcm_token,  // FCM token của người nhận
            data.status,     // Trạng thái gửi thông báo (success hoặc fail)
            data.message     // Tin nhắn mô tả chi tiết
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = NotificationModel;
