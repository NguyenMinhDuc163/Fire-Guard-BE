const { addFamilyMember, getFamilyMembers, removeFamilyMember} = require('../services/family.service');
const { createResponse } = require('../utils/responseHelper');
const { logger } = require('../utils/logger');
const { validateFamilyModifyData } = require('../utils/validation');

// Controller: Thêm người thân
exports.addFamilyMember = async (req, res) => {
    const { user_id, email } = req.body;

    // Validate dữ liệu đầu vào
    const { error } = validateFamilyModifyData(req.body);
    if (error) {
        return res.status(200).json(
            createResponse('fail', error.details[0].message, 400)
        );
    }

    try {
        logger.info('Bắt đầu thêm người thân.', { meta: { user_id, email } });

        // Gọi service để thêm người thân và lấy danh sách người thân
        const familyMembers = await addFamilyMember(user_id, email);

        logger.info(`Đã thêm người thân ${email} cho chủ sở hữu ${user_id}.`);

        res.status(201).json(
            createResponse('success', 'Đã thêm thành công người thân vào danh sách nhận thông báo', 201, [])
        );
    } catch (error) {
        logger.error(`Lỗi khi thêm người thân: ${error.message}`, { meta: { user_id, email, error } });

        res.status(200).json(
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
        console.log(error)
        logger.error(`Lỗi khi lấy danh sách người thân: ${error.message}`, { meta: { user_id, error } });

        res.status(200).json(
            createResponse('fail', 'Không thể lấy danh sách người thân.', 500)
        );
    }
};

exports.removeFamilyMember = async (req, res) => {
    const { user_id, family_member_id } = req.body;

    // Validate dữ liệu đầu vào
    const { error } = validateFamilyModifyData(req.body);
    if (error) {
        return res.status(200).json(
            createResponse('fail', error.details[0].message, 400)
        );
    }


    try {
        logger.info('Bắt đầu xáa nguoi than', { meta: { user_id, family_member_id } });

        // Gọi service để thêm người thân và lấy danh sách người thân
        const FamilyMember = await removeFamilyMember(user_id, family_member_id);

        logger.info(`Đã xóa người thân ${family_member_id} cho chủ sở hữu ${user_id}.`);

        res.status(200).json(
            createResponse('success', 'Đã xóa người thân vào danh sách.', 200, [])
        );
    } catch (error) {
        logger.error(`Lỗi khi xóa người thân: ${error.message}`, { meta: { user_id, family_member_id, error } });

        res.status(200).json(
            createResponse('fail', error.message, 400)
        );
    }
}