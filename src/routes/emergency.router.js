const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergency.controller');

router.post('/api/v1/emergency/call', emergencyController.callFireDepartment);

module.exports = router;
