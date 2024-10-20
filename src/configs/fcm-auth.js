const { GoogleAuth } = require('google-auth-library');

// Đường dẫn đến file JSON
const SERVICE_ACCOUNT_FILE = 'fire-guard-5a3b2-firebase-adminsdk-9nq7d-d9df311402.json';

// Hàm lấy access token
async function getAccessToken() {
    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_FILE,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();
    console.log('FCM Token:', token.token);
}

getAccessToken().catch(console.error);
