// fireAlarm.controller.js
const fireAlarmService = require('../services/fireAlarm.service');

// Lấy danh sách tất cả các thiết bị báo cháy
exports.getAllFireAlarms = async (req, res) => {
    try {
        const fireAlarms = await fireAlarmService.getAllFireAlarms();
        res.json(fireAlarms);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving fire alarms" });
    }
};

// Thêm một thiết bị báo cháy mới
exports.addFireAlarm = async (req, res) => {
    try {
        const { location, status } = req.body;
        const newFireAlarm = await fireAlarmService.addFireAlarm(location, status);
        res.status(201).json(newFireAlarm);
    } catch (error) {
        res.status(500).json({ message: "Error adding fire alarm" });
    }
};
