const { getHistory } = require('../services/history.service');
const { validateHistoryRequest } = require('../utils/validation');

exports.getHistory = async (req, res) => {
    const { user_id, start_date, end_date } = req.query;

    const { error } = validateHistoryRequest(req.query);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.details[0].message,
        });
    }

    try {
        const history = await getHistory(user_id, start_date, end_date);
        if (history.length > 0) {
            res.status(200).json({
                status: 'success',
                data: history,
            });
        } else {
            res.status(404).json({
                status: 'fail',
                message: 'Không tìm thấy lịch sử.',
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Lỗi khi truy xuất lịch sử.',
            error: err.message,
        });
    }
};
