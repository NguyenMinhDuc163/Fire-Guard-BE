const express = require('express');
const router = express.Router();
const familyNotificationController = require('../controllers/familyNotification.controller');

router.post('/api/v1/notifications/family', familyNotificationController.notifyFamilyMember);

module.exports = router;
