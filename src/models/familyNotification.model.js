const pool = require('../configs/db.config');

class FamilyNotificationModel {
    static async save(data) {
        const query = `
            INSERT INTO family_notifications (user_id, family_member_id, phone_number, message, status, response_message, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *;
        `;
        const values = [
            data.user_id,           // ID người dùng gửi thông báo
            data.family_member_id,   // ID người thân nhận thông báo
            data.phone_number,       // Số điện thoại người thân
            data.message,            // Nội dung thông báo
            data.status,             // Trạng thái (success hoặc fail)
            data.response_message    // Tin nhắn mô tả chi tiết (lỗi hoặc thành công)
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = FamilyNotificationModel;
