const { callFireDepartment } = require('../services/emergency.service');
const { validateEmergencyData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');
const EmergencyModel = require('../models/emergency.model');

const lastFireDepartmentCall = {}; // Lưu timestamp của mỗi lần gọi theo vị trí

exports.callFireDepartment = async (req, res) => {
    const { error } = validateEmergencyData(req.body);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
        return res.status(400).json(
            createResponse('fail', error.details[0].message, 400, [], error.details[0].message)
        );
    }

    const { location, phone_number } = req.body; // Lấy phone_number từ request nếu có
    const now = Date.now(); // Lấy timestamp hiện tại
    const lastCall = lastFireDepartmentCall[location] || 0; // Kiểm tra lần gọi cuối cho địa điểm này

    logger.info(`Last call for ${location}: ${lastCall}, Now: ${now}, Diff: ${now - lastCall}`, { meta: { location, lastCall, now } });

    // Kiểm tra nếu chưa đủ 5 phút (300000ms)
    if (now - lastCall < 300000) {
        logger.warn(`Yêu cầu gửi thông báo cứu hỏa quá sớm. Vui lòng đợi thêm thời gian.`, { meta: { location, timeDifference: now - lastCall } });
        return res.status(429).json(
            createResponse('fail', 'Vui lòng đợi 5 phút trước khi gửi thông báo cứu hỏa tiếp theo.', 429, [])
        );
    }

    try {
        // Gọi lực lượng cứu hỏa với số điện thoại truyền vào hoặc lấy từ .env
        const response = await callFireDepartment(req.body, phone_number || process.env.FIRE_DEPARTMENT_PHONE);

        // Lưu log thành công vào cơ sở dữ liệu
        await EmergencyModel.save({
            location: req.body.location,
            phone_number: phone_number || process.env.FIRE_DEPARTMENT_PHONE,
            incident_details: req.body.incident_details,
            status: 'success',
            response_message: 'Lực lượng cứu hỏa đã được thông báo thành công.'
        });

        // Cập nhật timestamp cho địa điểm này
        lastFireDepartmentCall[location] = now;

        logger.info('Lực lượng cứu hỏa đã được thông báo.', { meta: { location, phone_number } });

        res.status(200).json(
            createResponse('success', 'Lực lượng cứu hỏa đã được thông báo.', 200, [])
        );
    } catch (err) {
        // Lưu log thất bại vào cơ sở dữ liệu
        await EmergencyModel.save({
            location: req.body.location,
            phone_number: phone_number || process.env.FIRE_DEPARTMENT_PHONE,
            incident_details: req.body.incident_details,
            status: 'fail',
            response_message: err.message
        });

        logger.error(`Lỗi khi thông báo lực lượng cứu hỏa: ${err.message}`, { meta: { request: req.body, error: err } });
        res.status(500).json(
            createResponse('fail', 'Lỗi hệ thống.', 500, [], err.message)
        );
    }
};
