const express = require('express');
const router = express.Router();
const sensorDataController = require('../controllers/sensorData.controller');

router.post('/api/v1/sensors/data', sensorDataController.receiveSensorData);

module.exports = router;
