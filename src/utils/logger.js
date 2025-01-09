const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const pool = require('../configs/db.config');
const {body} = require("express-validator");

// Hàm lọc ra những headers quan trọng
const filterHeaders = (headers) => {
    const allowedHeaders = ['authorization', 'content-type'];  // Chỉ giữ lại các header quan trọng
    let filteredHeaders = {};
    allowedHeaders.forEach(header => {
        if (headers[header]) {
            filteredHeaders[header] = headers[header];
        }
    });
    return filteredHeaders;
};

// Hàm định dạng JSON để hiển thị trên một dòng mà không có dấu gạch chéo
const formatJsonInline = (obj) => {
    return JSON.stringify(obj, null, 0);  // Định dạng JSON trên 1 dòng
};

// Định dạng log mới cho console
const logFormat = printf(({ level, message, timestamp, meta }) => {
    return [
        `\n${timestamp} [${level}]`,                             // Dòng chứa timestamp và level của log
        `Method: ${meta?.request?.method || 'N/A'}`,             // Dòng chứa phương thức HTTP (GET, POST, etc.)
        `URL: ${meta?.request?.url || 'N/A'}`,                   // Dòng chứa URL được gọi
        `Headers: ${JSON.stringify(filterHeaders(meta?.request?.headers || {}))}`, // Dòng chứa các headers quan trọng
        `Request Body: ${formatJsonInline(meta?.request?.body || {})}`, // Dòng chứa body của request trên 1 dòng
        `Response Status: ${meta?.response?.statusCode || 'N/A'}`,    // Dòng chứa mã trạng thái của response
        `Response Body: ${formatJsonInline(meta?.response?.body || {})}` // Dòng chứa body của response trên 1 dòng
    ].join('\n');  // Ghép các dòng lại với nhau
});

// Tạo logger
const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(),  // Giúp hiển thị log đẹp hơn với màu sắc
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat  // Định dạng log đơn giản cho console
    ),
    transports: [
        new transports.Console(),  // Chỉ hiển thị log trên console
    ],
});

// Hàm để lưu log vào database (chỉ lưu các headers quan trọng và xoá dấu gạch chéo trong JSON)
const saveLogToDB = async (level, message, req, res) => {
    const query = `
    INSERT INTO server_log (level, message, status_code, method, url, headers, request_body, response_body, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
  `;
    const values = [
        level,
        message,
        res.statusCode,                                  // Status code của response
        req.method,                                      // Phương thức HTTP (GET, POST, etc.)
        req.originalUrl,                                 // URL được gọi
        JSON.stringify(filterHeaders(req.headers)),      // Chỉ lưu các headers quan trọng
        JSON.stringify(req.body),                        // Body của request dưới dạng JSON
        res.body ? JSON.stringify(res.body) : null       // Kiểm tra trước khi lưu body
    ];
    try {
        await pool.query(query, values);
    } catch (err) {
        console.error('Lỗi khi lưu log vào database:', err);
    }
};

// Middleware để ghi log (console sẽ đơn giản, database sẽ đầy đủ nhưng lọc thông tin)
const logMiddleware = (req, res, next) => {
    const oldSend = res.send;

    res.send = function (data) {
        res.body = data;  // Gán body của response trước khi gửi
        return oldSend.apply(res, arguments);
    };
    res.on('finish', () => {
        const message = `${req.method} ${req.originalUrl} ${res.statusCode}`;
        const meta = {
            request: {
                method: req.method,
                url: req.originalUrl,
                headers: req.headers, // Headers đầy đủ, sẽ được lọc khi in ra console và database
                body: req.body,
            },
            response: {
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
                body: null, // Mặc định là null nếu không có body
            },
        };

        // Kiểm tra và parse body nếu là JSON hợp lệ
        try {
            if (res.body) {
                meta.response.body = JSON.parse(res.body);
            }
        } catch (err) {
            console.warn('Không thể parse response body:', err.message);
        }

        logger.info(message, { meta }); // Log đơn giản ra console
        saveLogToDB('info', message, req, res); // Lưu đầy đủ thông tin đã lọc vào database
    });

    next();
};

module.exports = {
    logger,
    logMiddleware,
};
