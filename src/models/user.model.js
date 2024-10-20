const pool = require('../configs/db.config');

class UserModel {
    // Đăng ký người dùng mới
    static async register(data) {
        const query = `
            INSERT INTO users (username, email, password, token_fcm)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email, created_at;
        `;
        const values = [data.username, data.email, data.password, data.token_fcm];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    // Tìm người dùng theo email
    static async findByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }
}

module.exports = UserModel;
