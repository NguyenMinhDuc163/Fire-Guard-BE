const express = require('express');
const router = express.Router();
const guidesAndNewsAddController = require('../controllers/guidesAndNewsAdd.controller');

router.post('/api/v1/guides_and_news/add', guidesAndNewsAddController.addGuidesAndNews);

module.exports = router;
