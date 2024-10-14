const express = require('express');
const router = express.Router();
const guidesAndNewsController = require('../controllers/guidesAndNews.controller');

router.get('/api/v1/guides_and_news', guidesAndNewsController.getGuidesAndNews);

module.exports = router;
