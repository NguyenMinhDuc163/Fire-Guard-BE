const express = require('express');
const router = express.Router();
const iotStatusController = require('../controllers/iotStatus.controller');

router.get('/api/v1/iot/status', iotStatusController.checkIotStatus);

module.exports = router;
