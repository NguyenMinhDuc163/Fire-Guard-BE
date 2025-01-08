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
const authRouter = require('./routes/auth.router');
const { logMiddleware } = require('./utils/logger');
const { getAccessToken } = require('./configs/token.service'); // Import service để gọi đến Firebase
const userLocationRouter = require('./routes/userLocation.router');



app.use(express.json());
app.use(logMiddleware);
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
app.use(authRouter);
app.use(userLocationRouter);

// Khi server khởi động, gọi Firebase để lấy token mới và lưu vào DB
getAccessToken()
    .then(() => {
        console.log('Token đã được cập nhật khi khởi động server.');
    })
    .catch((err) => {
        console.error('Lỗi khi lấy token từ Firebase lúc khởi động server:', err);
    });

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Fire Alarm Backend System',
        status: 'success'
    });
});


module.exports = app;
