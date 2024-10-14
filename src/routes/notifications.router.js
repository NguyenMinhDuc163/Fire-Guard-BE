const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');

router.post('/api/v1/notifications/send', notificationsController.sendNotification);

module.exports = router;
