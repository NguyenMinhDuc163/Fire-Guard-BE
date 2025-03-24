const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../configs/db.config');

// Đảm bảo thư mục tồn tại
const uploadDir = 'public/uploads/avatars';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu trữ
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: async function (req, file, cb) {
        try {
            // Lấy username từ database dựa vào userId
            const userId = req.user?.userId;
            const result = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);

            // Nếu không tìm thấy user, sử dụng userId làm prefix
            let username = userId;
            if (result.rows.length > 0) {
                // Lấy username và chuyển đổi thành dạng URL friendly
                username = result.rows[0].username
                    .toLowerCase()
                    .replace(/\s+/g, '-')      // Thay thế khoảng trắng bằng dấu gạch ngang
                    .replace(/[^\w\-]+/g, '')  // Loại bỏ ký tự đặc biệt
                    .replace(/\-\-+/g, '-');   // Loại bỏ nhiều dấu gạch ngang liên tiếp
            }

            const timestamp = Date.now();
            const ext = path.extname(file.originalname);
            const filename = `avatar-${username}-${timestamp}${ext}`;

            cb(null, filename);
        } catch (error) {
            // Nếu có lỗi khi truy vấn database, sử dụng định dạng backup
            const timestamp = Date.now();
            const uniqueSuffix = Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            const filename = `avatar-user-${timestamp}-${uniqueSuffix}${ext}`;

            cb(null, filename);
        }
    }
});

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
    }
};

// Khởi tạo middleware upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // giới hạn 2MB
    },
    fileFilter: fileFilter
});

module.exports = { upload };