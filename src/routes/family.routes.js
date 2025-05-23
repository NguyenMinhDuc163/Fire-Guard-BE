const express = require('express');
const router = express.Router();
const familyController = require('../controllers/family.controller');

router.post('/api/v1/family/add', familyController.addFamilyMember);
router.get('/api/v1/family/list', familyController.getFamilyMembers);
router.post('/api/v1/family/delete', familyController.removeFamilyMember);
module.exports = router;
