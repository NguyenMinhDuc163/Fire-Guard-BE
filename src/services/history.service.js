const pool = require('../configs/db.config');
const convertDateToTimestamp = (dateString, isEndOfDay = false) => {
    const date = new Date(dateString);

    if (isEndOfDay) {
        date.setHours(23, 59, 59, 999);
    } else {
        date.setHours(0, 0, 0, 0);
    }

    return date.toISOString();
};

const getHistory = async (user_id, start_date, end_date) => {
    // Lấy thông báo như bình thường
    let notificationQuery = `
    SELECT 
        id AS incident_id, 
        message, 
        COALESCE(title, '') AS title, 
        COALESCE(body, '') AS body, 
        timestamp
    FROM notifications
    `;
    const notificationValues = [];

    if (user_id) {
        notificationQuery += `WHERE user_id = $1`;
        notificationValues.push(user_id);
    }

    if (start_date && end_date) {
        const startTimestamp = convertDateToTimestamp(start_date);
        const endTimestamp = convertDateToTimestamp(end_date, true);

        if (user_id) {
            notificationQuery += ` AND timestamp BETWEEN $2 AND $3`;
        } else {
            notificationQuery += `WHERE timestamp BETWEEN $1 AND $2`;
        }

        notificationValues.push(startTimestamp, endTimestamp);
    }

    notificationQuery += ` ORDER BY timestamp DESC;`;

    // Lấy 5 URL ảnh mới nhất
    const imageQuery = `
    SELECT image_url 
    FROM fire_detections 
    ORDER BY timestamp DESC 
    LIMIT 5;
    `;

    // Thực hiện cả hai truy vấn
    const [notificationResult, imageResult] = await Promise.all([
        pool.query(notificationQuery, notificationValues),
        pool.query(imageQuery)
    ]);

    // Lấy danh sách URL ảnh
    const imageUrls = imageResult.rows.map(row => row.image_url);

    // Gán URL ảnh cho mỗi thông báo, nếu hết ảnh thì lặp lại từ đầu
    const notifications = notificationResult.rows.map((notification, index) => {
        const imageIndex = index % imageUrls.length; // Lấy phần dư để lặp lại khi cần
        return {
            ...notification,
            image_url: imageUrls.length > 0 ? imageUrls[imageIndex] : ''
        };
    });

    return notifications;
};


module.exports = {
    getHistory,
};
