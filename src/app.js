const express = require('express');
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



require('dotenv').config();

app.use(express.json());

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

app.get('/', (req, res) => {
    res.send('Welcome to the Fire Alarm Backend System');
});

module.exports = app;
