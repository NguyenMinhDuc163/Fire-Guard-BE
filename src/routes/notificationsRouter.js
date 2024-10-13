// routers/notificationsRouter.js
const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');

router.post('/send', notificationsController.sendNotification);

module.exports = router;
