const express = require('express');
const router = express.Router();
const guidesAndNewsController = require('../controllers/guidesAndNews.controller');
const guidesAndNewsAddController = require("../controllers/guidesAndNewsAdd.controller");

router.get('/api/v1/guides_and_news', guidesAndNewsController.getGuidesAndNews);
router.post('/api/v1/guides_and_news/add', guidesAndNewsController.addGuidesAndNews);

module.exports = router;
