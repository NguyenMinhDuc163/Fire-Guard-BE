const pool = require('../configs/db.config');

// Hàm thêm người thân vào danh sách
const addFamilyMember = async (ownerId, familyMemberId) => {
    try {
        // Kiểm tra xem familyMemberId có tồn tại trong bảng users không
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
            // Trả về mảng rỗng nếu người thân đã tồn tại
            return [];
        }

        // Chèn dữ liệu vào bảng family_notifications
        const insertQuery = `
            INSERT INTO family_notifications (user_id, family_member_id, phone_number, token_fcm, status, message, timestamp) 
            VALUES ($1, $2, $3, $4, 'pending', 'Chưa có thông báo', NOW()) 
            RETURNING *;
        `;
        const values = [ownerId, familyMemberId, phone_number, token_fcm];

        await pool.query(insertQuery, values);

        // Lấy danh sách tất cả người thân của ownerId
        const familyListQuery = `
            SELECT fn.family_member_id, u.username, fn.phone_number, fn.token_fcm
            FROM family_notifications fn
            JOIN users u ON fn.family_member_id = u.id
            WHERE fn.user_id = $1
        `;
        const familyList = await pool.query(familyListQuery, [ownerId]);

        return familyList.rows; // Trả về danh sách người thân (mảng)
    } catch (error) {
        // Nếu có lỗi, trả về mảng rỗng
        return [];
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


// Hàm xóa thành viên khỏi gia đình
const removeFamilyMember = async (ownerId, familyMemberId) => {
    try {
        // Kiểm tra xem familyMemberId có tồn tại trong danh sách gia đình của ownerId không
        const checkExist = await pool.query(
            'SELECT id FROM family_notifications WHERE user_id = $1 AND family_member_id = $2',
            [ownerId, familyMemberId]
        );

        if (checkExist.rows.length === 0) {
            throw new Error('Người thân không tồn tại trong gia đình.');
        }

        // Xóa thành viên khỏi bảng family_notifications
        await pool.query(
            'DELETE FROM family_notifications WHERE user_id = $1 AND family_member_id = $2',
            [ownerId, familyMemberId]
        );

        // Lấy danh sách tất cả người thân của ownerId sau khi xóa
        const familyListQuery = `
            SELECT fn.family_member_id, u.username, fn.phone_number, fn.token_fcm
            FROM family_notifications fn
            JOIN users u ON fn.family_member_id = u.id
            WHERE fn.user_id = $1
        `;
        const familyList = await pool.query(familyListQuery, [ownerId]);

        return familyList.rows; // Trả về danh sách người thân (mảng)
    } catch (error) {
        throw error;
    }
};

module.exports = { addFamilyMember, getFamilyMembers, removeFamilyMember };

module.exports = { addFamilyMember, getFamilyMembers };

module.exports = { addFamilyMember, getFamilyMembers, removeFamilyMember };
