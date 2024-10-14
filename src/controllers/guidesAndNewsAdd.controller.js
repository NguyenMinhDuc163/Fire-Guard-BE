const { addMultipleGuidesAndNews } = require('../services/guidesAndNewsAdd.service');
const { validateMultipleGuidesAndNewsData } = require('../utils/validation');

exports.addGuidesAndNews = async (req, res) => {
    const { error } = validateMultipleGuidesAndNewsData(req.body);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.details[0].message,
        });
    }

    try {
        await addMultipleGuidesAndNews(req.body);
        res.status(200).json({
            status: 'success',
            message: 'Dữ liệu đã được thêm thành công.',
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Lỗi hệ thống khi thêm dữ liệu.',
            error: err.message,
        });
    }
};
