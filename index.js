// dataSave.router.js
const express = require('express');
const app = express();
const fireAlarmRoute = require('./src/routes/fireAlarm.route');

app.use(express.json()); // Để phân tích cú pháp JSON trong body của request

// Sử dụng route
app.use('/api', fireAlarmRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
