const pool = require('../configs/db.config');

class UserModel {
    // Đăng ký người dùng mới
    static async register(data) {
        const query = `
        INSERT INTO users (username, email, password, token_fcm, phone_number, click_send_name, click_send_key)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, username, email, phone_number, click_send_name, click_send_key, created_at;
    `;
        const values = [
            data.username,
            data.email,
            data.password,
            data.token_fcm || null,
            data.phone_number || null,
            data.click_send_name || null,
            data.click_send_key || null
        ];
        const result = await pool.query(query, values);

        // Bọc object trong một mảng trước khi trả về
        return [result.rows[0]];
    }

    // Tìm người dùng theo email
    // static async findByEmail(email) {
    //     const query = `SELECT * FROM users WHERE email = $1`;
    //     const result = await pool.query(query, [email]);
    //     return result.rows[0];
    // }

    static async findByEmail(email) {
        // Truy vấn để tìm người dùng theo email
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(query, [email]);

        // Nếu không tìm thấy người dùng, trả về null
        if (result.rows.length === 0) {
            return null;
        }

        const user = result.rows[0];

        // Truy vấn riêng để kiểm tra người dùng có phải là admin không
        const adminCheckQuery = `SELECT 1 FROM admins WHERE user_id = $1 LIMIT 1`;
        const adminCheckResult = await pool.query(adminCheckQuery, [user.id]);

        // Trả về thông tin người dùng và thông tin quyền admin
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            phone_number: user.phone_number,
            password: user.password,
            is_admin: adminCheckResult.rows.length > 0 ? "1" : 0
        };
    }

    // Cập nhật mật khẩu
    static async updatePassword(userId, hashedPassword) {
        const query = `
        UPDATE users
        SET password = $1
        WHERE id = $2
    `;
        const values = [hashedPassword, userId];
        await pool.query(query, values);
    }

    static async updateTokenFCM(userId, tokenFcm) {
        const query = `
        UPDATE users
        SET token_fcm = $1
        WHERE id = $2
    `;
        const values = [tokenFcm, userId];
        await pool.query(query, values);
    }
    // Tìm người dùng theo id
    static async findById(id) {
        const query = `SELECT * FROM users WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
    // update user
    static async updateUser(userId, data) {
        const query = `
        UPDATE users
        SET 
            email = COALESCE($1, email),
            phone_number = COALESCE($2, phone_number),
            click_send_name = COALESCE($3, click_send_name),
            click_send_key = COALESCE($4, click_send_key),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING id, username, email, phone_number, click_send_name, click_send_key, updated_at;
    `;
        const values = [
            data.email || null,
            data.phone_number || null,
            data.click_send_name || null,
            data.click_send_key || null,
            userId
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }


}



module.exports = UserModel;
