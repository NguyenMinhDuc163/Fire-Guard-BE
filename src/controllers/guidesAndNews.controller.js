const { getGuidesAndNews } = require('../services/guidesAndNews.service');
const { validateGuidesAndNewsQuery } = require('../utils/validation');

exports.getGuidesAndNews = async (req, res) => {
    const { category, limit } = req.query;

    const { error } = validateGuidesAndNewsQuery(req.query);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            message: error.details[0].message,
        });
    }

    try {
        const data = await getGuidesAndNews(category, limit || 10); // Mặc định limit là 10
        if (data.length > 0) {
            res.status(200).json({
                status: 'success',
                data: data,
            });
        } else {
            res.status(404).json({
                status: 'fail',
                message: 'Không có dữ liệu phù hợp.',
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: 'Lỗi khi truy xuất dữ liệu.',
            error: err.message,
        });
    }
};
