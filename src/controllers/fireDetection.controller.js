// src/controllers/fireDetection.controller.js
const { saveFireDetectionImage, getFireDetectionImages } = require('../services/fireDetection.service');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');
const { validateFireDetectionData } = require('../utils/validation');
const axios = require('axios');

// Lấy các biến từ env
const BASE_URL = process.env.BASE_URL;
const PHONE_NUMBER = process.env.PHONE_NUMBER;
const NOTIFICATION_INTERVAL = 5 * 1000;
let lastFireNotificationTime = 0;

exports.detectFire = async (req, res) => {
    try {
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

        const {
            device_id,
            confidence_score,
            is_fire,
            fire_severity,
            fire_percentage,
            fire_intensity,
            fire_growth_rate
        } = req.body;

        const result = await saveFireDetectionImage({
            device_id,
            file: req.file,
            confidence_score: parseFloat(confidence_score) || 0,
            is_fire: is_fire === 'true' || is_fire === true,
            fire_severity,
            fire_percentage: parseFloat(fire_percentage) || 0,
            fire_intensity: parseFloat(fire_intensity) || 0,
            fire_growth_rate: parseFloat(fire_growth_rate) || 0,
            removedImage: req.removedImage
        });

        logger.info('Ảnh phát hiện cháy đã được lưu thành công', {
            meta: {
                device_id,
                image_url: result.image_url,
                is_fire: result.is_fire,
                fire_severity: result.fire_severity,
                fire_percentage: result.fire_percentage
            }
        });

        if (result.is_fire && Date.now() - lastFireNotificationTime >= NOTIFICATION_INTERVAL) {
            lastFireNotificationTime = Date.now();

            if (fire_severity === 'max') {
                // Gửi thông báo
                await axios.post(`${BASE_URL}/notifications/send`, {
                    title: "CẢNH BÁO CHÁY CẤP ĐỘ CAO!",
                    body: `Phát hiện cháy cấp độ CAO với độ tin cậy ${confidence_score}, tỷ lệ cháy ${fire_percentage}%, cường độ ${fire_intensity}`
                });

                await axios.post(`${BASE_URL}/emergency/call`, {
                    location: "123 ABC Street",
                    incident_details: "TIN KHẨN CẤP: Hệ thống phát hiện cháy tự động phát hiện đám cháy cấp độ CAO!\n" +
                        `Cường độ cháy: ${fire_intensity}, Tỷ lệ cháy: ${fire_percentage}%\n` +
                        "Vui lòng sơ tán ngay lập tức qua lối thoát hiểm gần nhất.\n" +
                        "Không sử dụng thang máy! Nếu có khói, hãy bịt mũi và miệng bằng khăn ướt.\n" +
                        "Lực lượng cứu hỏa đã được thông báo và đang trên đường đến. Hãy bình tĩnh và đảm bảo an toàn cho bạn và những người xung quanh.\n" +
                        "Để được hỗ trợ thêm, vui lòng gọi dịch vụ khẩn cấp!",
                    timestamp: new Date().toISOString(),
                    phone_number: PHONE_NUMBER
                });

                logger.info('Đã gửi thông báo và gọi lực lượng cứu hỏa cho trường hợp cháy cấp độ CAO');
            }
            else if (fire_severity === 'mid') {
                await axios.post(`${BASE_URL}/notifications/send`, {
                    title: "Cảnh báo cháy cấp độ TRUNG BÌNH",
                    body: `Phát hiện cháy cấp độ TRUNG BÌNH với độ tin cậy ${confidence_score}, tỷ lệ cháy ${fire_percentage}%, cường độ ${fire_intensity}`
                });

                logger.info('Đã gửi thông báo cho trường hợp cháy cấp độ TRUNG BÌNH');
            }
            else if (fire_severity === 'min') {
                await axios.post(`${BASE_URL}/notifications/send`, {
                    title: "Cảnh báo cháy cấp độ THẤP",
                    body: `Phát hiện cháy cấp độ THẤP với độ tin cậy ${confidence_score}, tỷ lệ cháy ${fire_percentage}%, cường độ ${fire_intensity}`
                });

                logger.info('Đã gửi thông báo cho trường hợp cháy cấp độ THẤP');
            }
        }

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
        );n
    } catch (err) {
        logger.error(`Lỗi khi lấy danh sách ảnh: ${err.message}`, {
            meta: { error: err }
        });

        return res.status(200).json(
            createResponse('fail', 'Lỗi khi lấy danh sách ảnh', 500, [], err.message)
        );
    }
};