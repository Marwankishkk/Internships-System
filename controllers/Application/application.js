
const applicationService = require('../../services/Application/applicationService.js');

const createApplicationController = async (req, res) => {
    try {
        const result = await applicationService.createApplicationService(req.body, req.user);

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

module.exports = { createApplicationController };