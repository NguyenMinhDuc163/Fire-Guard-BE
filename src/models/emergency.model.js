const pool = require('../configs/db.config');

class EmergencyModel {
    static async save(data) {
        const query = `
            INSERT INTO emergency_calls (location, phone_number, incident_details, status, response_message, timestamp)
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING *;
        `;
        const values = [
            data.location,           // Địa điểm sự cố
            data.phone_number,       // Số điện thoại được gọi
            data.incident_details,   // Chi tiết sự cố
            data.status,             // Trạng thái cuộc gọi
            data.response_message    // Thông điệp phản hồi từ API (nếu có)
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = EmergencyModel;
