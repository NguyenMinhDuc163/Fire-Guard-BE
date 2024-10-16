const { getHistory } = require('../services/history.service');
const { validateHistoryRequest } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper'); 
exports.getHistory = async (req, res) => {
    const { user_id, start_date, end_date } = req.query;

        const { error } = validateHistoryRequest(req.query);
    if (error) {
                return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    try {
                const history = await getHistory(user_id, start_date, end_date);
        if (history.length > 0) {
                        res.status(200).json(createResponse('success', 'Lịch sử đã được truy xuất thành công.', 200, history));
        } else {
                        res.status(404).json(createResponse('fail', 'Không tìm thấy lịch sử.', 404, []));
        }
    } catch (err) {
                res.status(500).json(createResponse('fail', 'Lỗi khi truy xuất lịch sử.', 500, [], err.message));
    }
};
