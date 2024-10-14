const { getIotStatus } = require('../services/iotStatus.service');

exports.checkIotStatus = async (req, res) => {
    try {
        const iotStatus = await getIotStatus();
        res.status(200).json({
            status: 'success',
            iot_status: iotStatus,
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Lỗi hệ thống.',
            error: err.message,
        });
    }
};
