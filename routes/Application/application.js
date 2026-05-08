const express = require('express');
const {authMiddleware,allowRoles} = require('../../middleware/auth.js');

const router = express.Router();
const { createApplicationController, getApplicationsForStudentController } = require('../../controllers/Application/application.js');

router.post('/',authMiddleware,allowRoles('student'), createApplicationController);


module.exports = router;
