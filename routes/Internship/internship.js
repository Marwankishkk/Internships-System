const express = require('express');
const { createInternshipController ,getIntershipsForStudentController ,getInternshipApplicationsController} = require('../../controllers/Internship/internship.js');
const {authMiddleware,allowRoles} = require('../../middleware/auth.js');

const router = express.Router();

router.post('/', authMiddleware
    ,allowRoles("company")
    ,createInternshipController);

router.get('/', authMiddleware
    ,allowRoles("student")
    ,getIntershipsForStudentController);
router.get('/applications',authMiddleware,allowRoles('company'),getInternshipApplicationsController)
module.exports = router;