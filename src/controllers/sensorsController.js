// controllers/sensorsController.js
const sensorsService = require('../services/sensorsService');

exports.receiveSensorData = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await sensorsService.receiveSensorData(data);
        res.status(201).json({
            status: 'success',
            data: result,
            message: 'Dữ liệu cảm biến đã được nhận và lưu trữ.',
        });
    } catch (error) {
        next(error);
    }
};
