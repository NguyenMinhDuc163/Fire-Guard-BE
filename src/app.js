const express = require('express');

require('dotenv').config();
const app = express();
const sensorDataRouter = require('./routes/sensorData.router');
const dataSaveRouter = require('./routes/dataSave.router');
const notificationsRouter = require('./routes/notifications.router');
const emergencyRouter = require('./routes/emergency.router');
const familyNotificationRouter = require('./routes/familyNotification.router');
const historyRouter = require('./routes/history.router');
const iotStatusRouter = require('./routes/iotStatus.router');
const iotStatusSaveRouter = require('./routes/iotStatusSave.router');
const guidesAndNewsRouter = require('./routes/guidesAndNews.router');
const guidesAndNewsAddRouter = require('./routes/guidesAndNewsAdd.router');
const authRouter = require('./routes/auth.router'); // Route công khai
const userLocationRouter = require('./routes/userLocation.router');

const { logMiddleware } = require('./utils/logger');
const { getAccessToken } = require('./configs/token.service'); // Import service để gọi đến Firebase
const { authenticateJWT } = require('./middleware/authMiddleware'); // Middleware xác thực JWT

// Middleware để parse JSON và ghi log
app.use(express.json());
app.use(logMiddleware);

// Middleware xác thực JWT cho toàn bộ route, trừ route công khai
app.use((req, res, next) => {
    const publicRoutes = [
        '/api/v1/auth/login',
        '/api/v1/auth/register',
        '/api/v1/auth/forgot_password',
        '/favicon.ico',
        '/reset_password_confirm',
        '/'
    ]; // Danh sách các route công khai

    if (publicRoutes.includes(req.path)) {
        return next(); // Bỏ qua xác thực nếu là route công khai
    }

    authenticateJWT(req, res, next); // Thực hiện xác thực JWT
});

// Route công khai
app.use(authRouter);

// Các route yêu cầu xác thực JWT
app.use(sensorDataRouter);
app.use(dataSaveRouter);
app.use(notificationsRouter);
app.use(emergencyRouter);
app.use(familyNotificationRouter);
app.use(historyRouter);
app.use(iotStatusRouter);
app.use(iotStatusSaveRouter);
app.use(guidesAndNewsRouter);
app.use(guidesAndNewsAddRouter);
app.use(userLocationRouter);

// Khi server khởi động, gọi Firebase để lấy token mới và lưu vào DB
getAccessToken()
    .then(() => {
        console.log('Token đã được cập nhật khi khởi động server.');
    })
    .catch((err) => {
        console.error('Lỗi khi lấy token từ Firebase lúc khởi động server:', err);
    });

module.exports = app;
