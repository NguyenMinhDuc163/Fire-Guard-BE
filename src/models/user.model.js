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
    static async findByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
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
