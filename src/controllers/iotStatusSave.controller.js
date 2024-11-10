const { saveMultipleIotStatus } = require('../services/iotStatusSave.service');
const { validateMultipleIotStatusData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');
const axios = require('axios');

// Địa chỉ IP của ESP8266
const ESP8266_IP = 'http://192.168.1.50';

async function toggleBuzzerOnESP8266(status) {
    try {
        const response = await axios.post(`${ESP8266_IP}/toggle_buzzer`, null, {
            params: { status: status ? 'on' : 'off' },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        logger.info('Yêu cầu bật/tắt còi báo đã gửi đến ESP8266.', { meta: { response: response.data } });
    } catch (error) {
        logger.error('Lỗi khi gửi yêu cầu đến ESP8266:', { meta: { error: error.message } });
    }
}

exports.saveIotStatus = async (req, res) => {
    const { error } = validateMultipleIotStatusData(req.body);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
        const updatedDevices = await saveMultipleIotStatus(req.body); // Lấy trạng thái các thiết bị đã lưu

        logger.info('Trạng thái của các thiết bị đã được lưu thành công.', { meta: { request: req.body } });

        // Duyệt qua danh sách thiết bị để kiểm tra trạng thái cảm biến
        let buzzerStatus = false;
        for (const device of updatedDevices) {
            if (device.device_name === 'buzzer' && device.status === 'active') {
                buzzerStatus = true;
                break;
            }
        }

        // Gửi yêu cầu bật/tắt còi báo tới ESP8266
        await toggleBuzzerOnESP8266(buzzerStatus);

        // Trả về trạng thái của các thiết bị trong response
        res.status(200).json(createResponse('success', 'Trạng thái của các thiết bị đã được lưu thành công.', 200, updatedDevices));
    } catch (err) {
        logger.error(`Lỗi hệ thống khi lưu trạng thái thiết bị: ${err.message}`, { meta: { request: req.body, error: err } });
        res.status(500).json(createResponse('fail', 'Lỗi hệ thống khi lưu trạng thái thiết bị.', 500, [], err.message));
    }
};