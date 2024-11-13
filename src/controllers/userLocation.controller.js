const { addUserLocation, fetchUsers, fetchCoordinates } = require('../services/userLocation.service');
const { validateUserLocationData } = require('../utils/validation');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');

exports.handleUserLocation = async (req, res) => {
    const { error } = validateUserLocationData(req.body);
    if (error) {
        logger.error(`Validation Error: ${error.details[0].message}`, { meta: { request: req.body } });
        return res.status(400).json(createResponse('fail', error.details[0].message, 400, [], error.details[0].message));
    }

    const { userID, longitude, latitude, type } = req.body;

    try {
        if (type === "all") {
            // Trả về id, username, email từ bảng users
            const users = await fetchUsers();
            return res.status(200).json(createResponse('success', 'Users fetched successfully', 200, users));
        } else if (type === "longitude") {
            // Trả về tất cả các cặp tọa độ có từ bảng family_notifications
            const coordinates = await fetchCoordinates();
            return res.status(200).json(createResponse('success', 'Coordinates fetched successfully', 200, coordinates));
        } else if (type === "save" && userID && longitude && latitude) {
            // Lưu dữ liệu vào bảng family_notifications nếu có type = "save"
            await addUserLocation(userID, longitude, latitude);
            logger.info('Data has been added successfully.', { meta: { request: req.body } });
            res.status(200).json(createResponse('success', 'Data has been added successfully.', 200, []));
        } else {
            res.status(400).json(createResponse('fail', 'Invalid request parameters', 400, []));
        }
    } catch (err) {
        logger.error(`System Error: ${err.message}`, { meta: { request: req.body, error: err } });
        res.status(500).json(createResponse('fail', 'System Error.', 500, [], err.message));
    }
};
