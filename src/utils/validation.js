const Joi = require('joi');

exports.validateSensorData = (data) => {
    const schema = Joi.object({
        device_id: Joi.string().required(),
        flame_sensor: Joi.number().integer().required(), // Thay đổi kiểu dữ liệu thành số
        mq2_gas_level: Joi.number().integer().required(),
        mq135_air_quality: Joi.number().integer().required(),
        buzzer_status: Joi.boolean().required(), // Thêm trường mới
        timestamp: Joi.date().iso().required(),
    });
    return schema.validate(data);
};

exports.validateNotificationData = (data) => {
    const schema = Joi.object({
        user_id: Joi.number().required(),
        title: Joi.string().required(),
        body: Joi.string().required(),
    });

    return schema.validate(data);
};


exports.validateEmergencyData = (data) => {
    const schema = Joi.object({
        family_member_id: Joi.number().required(),
        location: Joi.string().required(),
        incident_details: Joi.string().required(),
        timestamp: Joi.date().iso().required(),
        phone_number: Joi.string().optional(), // Không bắt buộc
    });
    return schema.validate(data);
};


exports.validateFamilyNotificationData = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        family_member_id: Joi.string().required(),
        message: Joi.string().required(),
        timestamp: Joi.date().iso().required(),
        phone_number: Joi.string().optional(), // Không bắt buộc
    });
    return schema.validate(data);
};

exports.validateHistoryRequest = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().optional(), // user_id không còn bắt buộc nữa
        start_date: Joi.date().iso().optional(),
        end_date: Joi.date().iso().optional(),
    });
    return schema.validate(data);
};



exports.validateMultipleIotStatusData = (data) => {
    const schema = Joi.array().items(
        Joi.object({
            device_name: Joi.string().required(),
            status: Joi.string().valid('active', 'inactive', 'error').required(),
            timestamp: Joi.date().iso().required(),
        })
    );
    return schema.validate(data);
};

exports.validateGuidesAndNewsQuery = (data) => {
    const schema = Joi.object({
        category: Joi.string().valid('guide', 'fire_safety', 'escape_skills').required(),
        limit: Joi.number().integer().min(1).optional()
    });
    return schema.validate(data);
};


exports.validateMultipleGuidesAndNewsData = (data) => {
    const schema = Joi.array().items(
        Joi.object({
            title: Joi.string().required(),
            type: Joi.string().required(),
            url: Joi.string().uri().allow(null).optional(),
            content: Joi.string().allow(null).optional(),
            category: Joi.string().valid('guide', 'fire_safety', 'escape_skills').required(),
        })
    );
    return schema.validate(data);
};

exports.validateRegisterData = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        token_fcm: Joi.string().allow(null, '').optional(),
        phone_number: Joi.string().allow(null, '').optional(),
        click_send_name: Joi.string().allow(null, '').optional(),
        click_send_key: Joi.string().allow(null, '').optional(),
        alert_phone: Joi.string().allow(null, '').optional()
    });
    return schema.validate(data);
};

exports.validateLoginData = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        token_fcm: Joi.string().required(),
    });
    return schema.validate(data);
};


exports.validateUserLocationData = (data) => {
    const schema = Joi.object({
        userID: Joi.number().optional(),
        longitude: Joi.string().optional(),
        latitude: Joi.string().optional(),
        type: Joi.string().valid('all', 'longitude', 'save').optional(),
        is_fire: Joi.boolean().optional(), // is_fire không bắt buộc
    });

    return schema.validate(data);
};


exports.validateChangePasswordData = (data) => {
    const schema = Joi.object({
        id: Joi.number().required(), // id là bắt buộc
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).required() // Mật khẩu mới cần tối thiểu 6 ký tự
    });
    return schema.validate(data);
};


exports.validateFamilyModifyData = (data) => {
    const schema = Joi.object({
        user_id: Joi.number().integer().required(),
        email: Joi.string(),
        family_member_id: Joi.number().integer()
    });

    return schema.validate(data);
};

// src/utils/validation.js
exports.validateFireDetectionData = (data) => {
    const schema = Joi.object({
        device_id: Joi.string().required(),
        confidence_score: Joi.number().min(0).max(1).optional(),
        is_fire: Joi.boolean().optional(),
        image: Joi.any()
    }).unknown(true); // Cho phép các trường không được định nghĩa
    return schema.validate(data);
};