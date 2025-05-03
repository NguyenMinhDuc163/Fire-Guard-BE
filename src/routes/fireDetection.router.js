// src/routes/fireDetection.router.js
const express = require('express');
const router = express.Router();
const fireDetectionController = require('../controllers/fireDetection.controller');
const { fireDetectionUpload } = require('../middleware/fireDetectionUpload');

// Route upload ảnh phát hiện cháy (công khai)
router.post('/api/v1/fire/detection',
    fireDetectionUpload.single('image'),
    fireDetectionController.detectFire
);

// Route lấy danh sách ảnh
router.get('/api/v1/fire/images', fireDetectionController.getFireImages);

module.exports = router;