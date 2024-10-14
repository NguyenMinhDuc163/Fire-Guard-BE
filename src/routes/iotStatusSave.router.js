const express = require('express');
const router = express.Router();
const iotStatusSaveController = require('../controllers/iotStatusSave.controller');

router.post('/api/v1/iot/status/save', iotStatusSaveController.saveIotStatus);

module.exports = router;
