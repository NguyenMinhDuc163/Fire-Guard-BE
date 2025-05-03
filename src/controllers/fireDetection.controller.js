// src/controllers/fireDetection.controller.js
const { saveFireDetectionImage, getFireDetectionImages } = require('../services/fireDetection.service');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');
const { validateFireDetectionData } = require('../utils/validation');

exports.detectFire = async (req, res) => {
    try {
        // Validate dữ liệu
        const { error } = validateFireDetectionData(req.body);
        if (error) {
            logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
            return res.status(200).json(
                createResponse('fail', error.details[0].message, 400, [], error.details[0].message)
            );
        }

        // Kiểm tra xem có file ảnh không
        if (!req.file) {
            return res.status(200).json(
                createResponse('fail', 'Không có file ảnh được tải lên', 400, [])
            );
        }

        const { device_id, confidence_score, is_fire } = req.body;

        // Lưu ảnh
        const result = await saveFireDetectionImage({
            device_id,
            file: req.file,
            confidence_score: parseFloat(confidence_score) || 0,
            is_fire: is_fire === 'true' || is_fire === true,
            removedImage: req.removedImage
        });

        logger.info('Ảnh phát hiện cháy đã được lưu thành công', {
            meta: {
                device_id,
                image_url: result.image_url,
                is_fire: result.is_fire
            }
        });

        return res.status(200).json(
            createResponse('success', 'Ảnh phát hiện cháy đã được lưu thành công', 200, [result])
        );

    } catch (err) {
        logger.error(`Lỗi khi xử lý ảnh phát hiện cháy: ${err.message}`, {
            meta: { request: req.body, error: err }
        });

        return res.status(200).json(
            createResponse('fail', 'Lỗi khi xử lý ảnh phát hiện cháy', 500, [], err.message)
        );
    }
};

exports.getFireImages = async (req, res) => {
    try {
        const images = await getFireDetectionImages();

        logger.info('Lấy danh sách ảnh phát hiện cháy thành công');

        return res.status(200).json(
            createResponse('success', 'Lấy danh sách ảnh thành công', 200, images)
        );
    } catch (err) {
        logger.error(`Lỗi khi lấy danh sách ảnh: ${err.message}`, {
            meta: { error: err }
        });

        return res.status(200).json(
            createResponse('fail', 'Lỗi khi lấy danh sách ảnh', 500, [], err.message)
        );
    }
};