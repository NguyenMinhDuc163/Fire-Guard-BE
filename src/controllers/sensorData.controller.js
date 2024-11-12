const SensorDataService = require('../services/sensorData.service');
const { validateSensorData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');
const axios = require('axios');
let flameSensorCount = 0; // Bộ đếm cho số lần liên tiếp flame_sensor < 500
let gasLeakCount = 0; // Bộ đếm cho số lần liên tiếp mq2_gas_level = 0 và mq135_air_quality != 0
const BASE_URL = process.env.BASE_URL;
const PHONE_NUMBER = process.env.PHONE_NUMBER;
const NOTIFICATION_INTERVAL = 10 * 1000; // 30 giây
let lastFireNotificationTime = 0; // Thời gian gửi thông báo cháy gần nhất
let lastGasLeakNotificationTime = 0; // Thời gian gửi thông báo rò rỉ khí ga gần nhất
const FALMECOUNT = 3
const GASCOUNT = 3
const SOSCOUNT = 20

exports.receiveSensorData = async (req, res) => {
    const { error } = validateSensorData(req.body);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        await SensorDataService.processSensorData(req.body);

        logger.info('Dữ liệu cảm biến đã được nhận và đang xử lý.', { meta: { request: req.body } });

        const buzzerStatusCode = req.body.buzzer_status ? 0 : 1; // 0 là bật, 1 là tắt

        // Kiểm tra flame_sensor < 500
        if (req.body.flame_sensor < 500) {
            flameSensorCount += 1;
        } else {
            flameSensorCount = 0; // Reset đếm nếu giá trị không thỏa điều kiện
        }

        // Gửi thông báo nếu đạt 5 lần liên tiếp và đủ 30 giây từ lần gửi trước
        if (flameSensorCount >= FALMECOUNT && (Date.now() - lastFireNotificationTime >= NOTIFICATION_INTERVAL)) {
            lastFireNotificationTime = Date.now();
            await axios.post(`${BASE_URL}/notifications/send`, {
                title: "Cảnh báo cháy!",
                body: "Có tín hiệu cháy phát hiện!"
            });
            logger.info('Thông báo cảnh báo cháy đã được gửi.');
        }

        // Gọi cứu hỏa nếu đạt hơn 20 lần liên tiếp
        if (flameSensorCount > SOSCOUNT) {
            flameSensorCount = 0; // Reset đếm sau khi gọi cứu hỏa
            await axios.post(`${BASE_URL}/emergency/call`, {
                location: "123 ABC Street",
                incident_details: "Phát hiện cháy lớn.",
                timestamp: new Date().toISOString(),
                phone_number: PHONE_NUMBER
            });
            logger.info('Đã gọi lực lượng cứu hỏa.');
        }

        // Kiểm tra điều kiện rò rỉ khí ga
        if (req.body.mq2_gas_level === 0 || req.body.mq135_air_quality !== 0) {
            gasLeakCount += 1;
        } else {
            gasLeakCount = 0; // Reset đếm nếu giá trị không thỏa điều kiện
        }

        // Gửi cảnh báo rò rỉ khí ga nếu đạt hơn 5 lần liên tiếp và đủ 30 giây từ lần gửi trước
        if (gasLeakCount > GASCOUNT && (Date.now() - lastGasLeakNotificationTime >= NOTIFICATION_INTERVAL)) {
            lastGasLeakNotificationTime = Date.now();
            await axios.post(`${BASE_URL}/notifications/send`, {
                title: "Cảnh báo rò rỉ khí ga",
                body: "Khu vực của bạn có nguy cơ rò rỉ khí ga vui lòng kiểm tra lại"
            });
            logger.info('Thông báo cảnh báo rò rỉ khí ga đã được gửi.');
        }

        res.status(200).json(createResponse('success', 'Dữ liệu đã được nhận và đang xử lý.', 200, [{
            buzzer_status: buzzerStatusCode
        }]));
    } catch (err) {
        logger.error(`Lỗi khi xử lý dữ liệu cảm biến: ${err.message}`, { meta: { request: req.body, error: err } });
        console.log(err);
        res.status(500).json(createResponse('fail', 'Lỗi khi xử lý dữ liệu.', 500, [], err.message));
    }
};
