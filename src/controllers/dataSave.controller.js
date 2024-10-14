const { saveSensorData } = require('../services/dataSave.service');
const { validateSensorData } = require('../utils/validation');

exports.saveSensorData = async (req, res) => {
    const { error } = validateSensorData(req.body);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.details[0].message,
        });
    }

    try {
        await saveSensorData(req.body);
        res.status(200).json({
            status: 'success',
            message: 'Dữ liệu đã được lưu thành công.',
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Lỗi khi lưu trữ dữ liệu.',
            error: err.message,
        });
    }
};
