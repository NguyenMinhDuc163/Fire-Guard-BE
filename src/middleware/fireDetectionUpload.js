// src/middleware/fireDetectionUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục tồn tại
const FIRE_IMAGES_DIR = 'public/uploads/fire-detections';
if (!fs.existsSync(FIRE_IMAGES_DIR)) {
    fs.mkdirSync(FIRE_IMAGES_DIR, { recursive: true });
}

// Lấy danh sách ảnh hiện có
const getExistingImages = () => {
    return fs.readdirSync(FIRE_IMAGES_DIR)
        .filter(file => file.startsWith('fire-'))
        .map(file => ({
            name: file,
            path: path.join(FIRE_IMAGES_DIR, file),
            stats: fs.statSync(path.join(FIRE_IMAGES_DIR, file))
        }))
        .sort((a, b) => a.stats.birthtimeMs - b.stats.birthtimeMs);
};

// Xóa ảnh cũ nhất nếu đã đạt giới hạn
const removeOldestImageIfNeeded = () => {
    const existingImages = getExistingImages();
    if (existingImages.length >= 5) {
        const oldestImage = existingImages[0];
        fs.unlinkSync(oldestImage.path);
        return oldestImage.name;
    }
    return null;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const removedImage = removeOldestImageIfNeeded();
        if (removedImage) {
            req.removedImage = removedImage;
        }
        cb(null, FIRE_IMAGES_DIR);
    },
    filename: function (req, file, cb) {
        const device_id = req.body.device_id || 'unknown';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `fire-${device_id}-${timestamp}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
    }
};

const fireDetectionUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // giới hạn 5MB
    },
    fileFilter: fileFilter
});

module.exports = { fireDetectionUpload };