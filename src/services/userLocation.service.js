const pool = require('../configs/db.config');

const fetchUsers = async () => {
    // Lấy id, username, và email từ bảng users
    const query = 'SELECT id, username, email FROM users';
    const result = await pool.query(query);
    return result.rows;
};

const fetchCoordinates = async () => {
    const query = `
        SELECT longitude, latitude, is_fire 
        FROM family_notifications 
        WHERE longitude IS NOT NULL AND latitude IS NOT NULL
    `;
    const result = await pool.query(query);
    return result.rows;
};


const addUserLocation = async (userID, longitude, latitude, isFire = false) => {
    const userQuery = 'SELECT token_fcm FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userID]);

    if (userResult.rowCount === 0) {
        throw new Error('User not found');
    }

    const token_fcm = userResult.rows[0].token_fcm;
    const familyMemberId = '1234';
    const phoneNumber = '+84916562796';
    const message = 'Da luu du lieu thanh cong';
    const status = 'SUCC';
    const responseMessage = 'No response';

    const insertQuery = `
        INSERT INTO family_notifications (
            user_id, family_member_id, phone_number, message, status, response_message, token_fcm, longitude, latitude, is_fire, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
    `;
    await pool.query(insertQuery, [userID, familyMemberId, phoneNumber, message, status, responseMessage, token_fcm, longitude, latitude, isFire]);
};


module.exports = { addUserLocation, fetchUsers, fetchCoordinates };
