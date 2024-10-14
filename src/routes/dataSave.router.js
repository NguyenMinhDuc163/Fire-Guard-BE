const express = require('express');
const router = express.Router();
const dataSaveController = require('../controllers/dataSave.controller');

router.post('/api/v1/data/save', dataSaveController.saveSensorData);

module.exports = router;
