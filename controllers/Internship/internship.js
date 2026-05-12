const { createInternship, getIntershipsForStudent, getInternshipApplications } = require('../../services/Internship/internshipService');
const { getInternshipById } = require('../../repositories/Internship/internship');
const createInternshipController = async (req, res) => {
    try {
        const result = await createInternship(req.body, req.user);

        return res.status(201).json({
            message: "Internship created successfully",
            data: result
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}
const getIntershipsForStudentController = async (req, res) => {
    try {
        const result = await getIntershipsForStudent(req.user);

        return res.status(200).json({
            message: "Internships retrieved successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}
const getInternshipApplicationsController = async (req, res) => {
    try {
        const result = await getInternshipApplications(req.body, req.user)
        return res.status(200).json({
            message: "Ranking retrieved successfully",
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

module.exports = { createInternshipController, getIntershipsForStudentController, getInternshipApplicationsController };