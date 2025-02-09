const pool = require('../configs/db.config');

// Hàm thêm người thân vào danh sách
const addFamilyMember = async (ownerId, familyMemberId) => {
    try {
        // Kiểm tra xem familyMemberId có tồn tại trong users không
        const userCheck = await pool.query('SELECT id, phone_number, token_fcm FROM users WHERE id = $1', [familyMemberId]);

        if (userCheck.rows.length === 0) {
            throw new Error('Người thân không tồn tại.');
        }

        const { phone_number, token_fcm } = userCheck.rows[0];

        // Kiểm tra xem người thân đã tồn tại trong danh sách chưa
        const checkExist = await pool.query(
            'SELECT id FROM family_notifications WHERE user_id = $1 AND family_member_id = $2',
            [ownerId, familyMemberId]
        );

        if (checkExist.rows.length > 0) {
            throw new Error('Người thân này đã có trong danh sách.');
        }

        // Chèn dữ liệu vào bảng family_notifications
        const insertQuery = `
            INSERT INTO family_notifications (user_id, family_member_id, phone_number, token_fcm, status, message, timestamp) 
            VALUES ($1, $2, $3, $4, 'pending', 'Chưa có thông báo', NOW()) 
            RETURNING *;
        `;
        const values = [ownerId, familyMemberId, phone_number, token_fcm];

        const result = await pool.query(insertQuery, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Hàm lấy danh sách người thân của một user
const getFamilyMembers = async (ownerId) => {
    try {
        const result = await pool.query(
            `SELECT fn.family_member_id, u.username, fn.phone_number, fn.token_fcm
             FROM family_notifications fn
             JOIN users u ON fn.family_member_id = u.id
             WHERE fn.user_id = $1`,
            [ownerId]
        );

        return result.rows;
    } catch (error) {
        throw error;
    }
};

module.exports = { addFamilyMember, getFamilyMembers };
