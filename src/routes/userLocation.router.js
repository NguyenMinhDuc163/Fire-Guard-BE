const express = require('express');
const router = express.Router();
const userLocationController = require('../controllers/userLocation.controller');

router.post('/api/v1/user_location', userLocationController.handleUserLocation);

module.exports = router;
