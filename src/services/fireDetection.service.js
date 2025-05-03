// src/services/fireDetection.service.js
const pool = require('../configs/db.config');

const saveFireDetectionImage = async (data) => {
    const { device_id, file, confidence_score, is_fire, removedImage } = data;

    // Nếu có ảnh cũ bị xóa, xóa record trong database
    if (removedImage) {
        const deleteQuery = `DELETE FROM fire_detections WHERE image_url LIKE $1`;
        await pool.query(deleteQuery, [`%${removedImage}%`]);
    }

    // Lưu thông tin vào database
    const insertQuery = `
        INSERT INTO fire_detections (device_id, image_url, confidence_score, is_fire, timestamp)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *;
    `;
    const values = [
        device_id,
        `/uploads/fire-detections/${file.filename}`,
        confidence_score || 0,
        is_fire || false
    ];

    const result = await pool.query(insertQuery, values);
    return result.rows[0];
};

const getFireDetectionImages = async () => {
    const query = `
        SELECT * FROM fire_detections
        ORDER BY timestamp DESC
        LIMIT 5;
    `;
    const result = await pool.query(query);
    return result.rows;
};

module.exports = {
    saveFireDetectionImage,
    getFireDetectionImages
};