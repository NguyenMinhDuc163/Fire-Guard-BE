const { GoogleAuth } = require('google-auth-library');
const pool = require('../configs/db.config'); // Kết nối PostgreSQL

const SERVICE_ACCOUNT_FILE = 'fire-guard-5a3b2-firebase-adminsdk-9nq7d-7d814fadd1.json';

// Hàm lấy Access Token từ Firebase
async function getAccessToken() {
    try {
        const auth = new GoogleAuth({
            keyFile: SERVICE_ACCOUNT_FILE,
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        const client = await auth.getClient();
        const token = await client.getAccessToken();

        console.log('FCM Token:', token.token); // In ra token

        if (!token.token) {
            throw new Error('Không thể lấy được Access Token từ Firebase.');
        }

        // Lưu token vào DB
        await pool.query(
            `INSERT INTO access_tokens (token, created_at) VALUES ($1, NOW())`,
            [token.token]
        );

        console.log('Token đã được lưu vào DB.');
        return token.token;
    } catch (error) {
        console.error('Lỗi khi lấy Access Token:', error.message); // Log lỗi chi tiết
        throw error;
    }
}

// Hàm lấy token từ DB nếu có, hoặc gọi Firebase để lấy mới
async function getSavedAccessToken() {
    const result = await pool.query(
        `SELECT token FROM access_tokens ORDER BY created_at DESC LIMIT 1`
    );

    if (result.rows.length > 0) {
        console.log('Token lấy từ DB:', result.rows[0].token); // In ra token từ DB
        return result.rows[0].token;
    } else {
        console.log('Không tìm thấy token trong DB, lấy mới từ Firebase.');
        return await getAccessToken();
    }
}

module.exports = { getAccessToken, getSavedAccessToken };
