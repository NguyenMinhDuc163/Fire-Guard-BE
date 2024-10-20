const { getIotStatus } = require('../services/iotStatus.service');
const { createResponse } = require('../utils/responseHelper');

exports.checkIotStatus = async (req, res) => {
    try {
        const iotStatus = await getIotStatus();
        res.status(200).json(createResponse('success', 'Trạng thái IoT đã được truy xuất thành công.', 200, iotStatus));
    } catch (err) {
        res.status(500).json(createResponse('fail', 'Lỗi hệ thống.', 500, [], err.message));
    }
};
