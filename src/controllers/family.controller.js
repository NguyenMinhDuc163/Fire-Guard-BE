const { addFamilyMember, getFamilyMembers } = require('../services/family.service');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');
const { validateFamilyNotificationData } = require('../utils/validation');

// Controller: Thêm người thân
exports.addFamilyMember = async (req, res) => {
    const { user_id, family_member_id } = req.body;

    // Validate dữ liệu đầu vào
    const { error } = validateFamilyNotificationData(req.body);
    if (error) {
        return res.status(400).json(
            createResponse('fail', error.details[0].message, 400)
        );
    }

    try {
        logger.info('Bắt đầu thêm người thân.', { meta: { user_id, family_member_id } });

        const newFamilyMember = await addFamilyMember(user_id, family_member_id);

        logger.info(`Đã thêm người thân ${family_member_id} cho chủ sở hữu ${user_id}.`);

        res.status(201).json(
            createResponse('success', 'Đã thêm người thân vào danh sách.', 201, newFamilyMember)
        );
    } catch (error) {
        logger.error(`Lỗi khi thêm người thân: ${error.message}`, { meta: { user_id, family_member_id, error } });

        res.status(400).json(
            createResponse('fail', error.message, 400)
        );
    }
};

// Controller: Lấy danh sách người thân
exports.getFamilyMembers = async (req, res) => {
    const { user_id } = req.query; // Nhận user_id từ query params

    try {
        logger.info('Lấy danh sách người thân.', { meta: { user_id } });

        const familyMembers = await getFamilyMembers(user_id);

        res.status(200).json(
            createResponse('success', 'Danh sách người thân.', 200, familyMembers)
        );
    } catch (error) {
        logger.error(`Lỗi khi lấy danh sách người thân: ${error.message}`, { meta: { user_id, error } });

        res.status(500).json(
            createResponse('fail', 'Không thể lấy danh sách người thân.', 500)
        );
    }
};
