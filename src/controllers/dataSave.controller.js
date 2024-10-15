const { saveSensorData } = require('../services/dataSave.service');
const { validateSensorData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');

exports.saveSensorData = async (req, res) => {
    const { error } = validateSensorData(req.body);
    if (error) {
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, null, error.details[0].message));
    }

    try {
        await saveSensorData(req.body);
        res.status(200).json(createResponse('success', 'Dữ liệu đã được lưu thành công.', 200));
    } catch (err) {
        res.status(500).json(createResponse('fail', 'Lỗi khi lưu trữ dữ liệu.', 500, null, err.message));
    }
};
