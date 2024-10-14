const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');

router.get('/api/v1/history', historyController.getHistory);

module.exports = router;
