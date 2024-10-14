const pool = require('../configs/db.config');

// Hàm chuyển đổi yyyy-mm-dd thành dạng timestamp với giờ phút giây bắt đầu hoặc kết thúc của ngày
const convertDateToTimestamp = (dateString, isEndOfDay = false) => {
    const date = new Date(dateString);

    if (isEndOfDay) {
        // Đặt giờ phút giây thành 23:59:59 để xác định cuối ngày
        date.setHours(23, 59, 59, 999);
    } else {
        // Đặt giờ phút giây thành 00:00:00 để xác định đầu ngày
        date.setHours(0, 0, 0, 0);
    }

    return date.toISOString(); // Trả về định dạng ISO 8601 phù hợp với timestamp trong CSDL
};

const getHistory = async (user_id, start_date, end_date) => {
    let query = `
    SELECT id AS incident_id, message, timestamp
    FROM notifications
    WHERE user_id = $1
  `;
    const values = [user_id];

    // Nếu có start_date và end_date, chuyển đổi và thêm điều kiện vào truy vấn
    if (start_date && end_date) {
        const startTimestamp = convertDateToTimestamp(start_date);
        const endTimestamp = convertDateToTimestamp(end_date, true); // true để lấy cuối ngày
        query += ` AND timestamp BETWEEN $2 AND $3`;
        values.push(startTimestamp, endTimestamp);
    }

    query += ` ORDER BY timestamp DESC;`;

    const result = await pool.query(query, values);
    return result.rows;
};

module.exports = {
    getHistory,
};
