const pool = require('../configs/db.config');

const fetchUsers = async () => {
    // Lấy id, username, và email từ bảng users
    const query = 'SELECT id, username, email FROM users';
    const result = await pool.query(query);
    return result.rows;
};

const fetchCoordinates = async () => {
    // Lấy tất cả các cặp tọa độ (longitude, latitude) có trong bảng family_notifications
    const query = 'SELECT longitude, latitude FROM family_notifications WHERE longitude IS NOT NULL AND latitude IS NOT NULL';
    const result = await pool.query(query);
    return result.rows;
};

const addUserLocation = async (userID, longitude, latitude) => {
    // Lấy token_fcm từ bảng users
    const userQuery = 'SELECT token_fcm FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userID]);

    if (userResult.rowCount === 0) {
        throw new Error('User not found');
    }

    const token_fcm = userResult.rows[0].token_fcm;
    const familyMemberId = '1234';             // Giá trị mặc định cho family_member_id
    const phoneNumber = '+84916562796';          // Số điện thoại mặc định
    const message = 'Da luu du lieu thanh cong';           // Tin nhắn mặc định
    const status = 'SUCC';               // Trạng thái mặc định
    const responseMessage = 'No response';  // Tin nhắn phản hồi mặc định

    // Lưu dữ liệu vào bảng family_notifications
    const insertQuery = `
        INSERT INTO family_notifications (
            user_id, family_member_id, phone_number, message, status, response_message, token_fcm, longitude, latitude, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
    `;
    await pool.query(insertQuery, [userID, familyMemberId, phoneNumber, message, status, responseMessage, token_fcm, longitude, latitude]);
};

module.exports = { addUserLocation, fetchUsers, fetchCoordinates };
