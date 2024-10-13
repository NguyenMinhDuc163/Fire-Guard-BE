// routers/sensorsRouter.js
const express = require('express');
const router = express.Router();
const sensorsController = require('../controllers/sensorsController');

router.post('/data', sensorsController.receiveSensorData);

module.exports = router;
