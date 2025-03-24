// models/verification.model.js
const pool = require('../config/db');
const crypto = require('crypto');

class VerificationToken {
    // Tạo token xác thực mới
    static async createToken(userId) {
        // Tạo token ngẫu nhiên
        const token = crypto.randomBytes(32).toString('hex');

        // Tính thời gian hết hạn (24 giờ từ thời điểm hiện tại)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const query = `
            INSERT INTO verification_tokens (user_id, token, expires_at)
            VALUES ($1, $2, $3)
            RETURNING id, token, expires_at;
        `;

        const result = await pool.query(query, [userId, token, expiresAt]);

        return result.rows[0];
    }

    // Tìm token xác thực theo token
    static async findByToken(token) {
        const query = `
            SELECT * FROM verification_tokens
            WHERE token = $1 AND expires_at > NOW();
        `;

        const result = await pool.query(query, [token]);
        return result.rows[0];
    }

    // Xóa token sau khi đã sử dụng
    static async deleteToken(tokenId) {
        const query = `DELETE FROM verification_tokens WHERE id = $1`;
        await pool.query(query, [tokenId]);
    }
}

module.exports = VerificationToken;