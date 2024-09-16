// fireAlarm.route.js
const express = require('express');
const router = express.Router();
const fireAlarmController = require('../controllers/fireAlarm.controller');

router.get('/fire-alarms', fireAlarmController.getAllFireAlarms);
router.post('/fire-alarms', fireAlarmController.addFireAlarm);

module.exports = router;
