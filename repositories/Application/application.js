const Application = require('../../models/Application/application');

const create = async (applicationData) => {
    return await Application.create(applicationData);
};


const countByStudent = async (studentId) => {
    console.log('Counting applications for student:', studentId);
    return await Application.countDocuments({ student: studentId });
};

const findOne = async (filter) => {
    return await Application.findOne(filter);
};

const findByStudent = async (studentId) => {
    return await Application.find({ student: studentId });
};

const findApplicationsForInternship = async(internshipId) => {
    
    return await Application.find({
        internship: internshipId,
        status : "pending"
    }).populate({
        path: 'student',
        select: 'name major gpa city'
    });


};

module.exports = {
    create,
    countByStudent,
    findOne,
    findByStudent,
    findApplicationsForInternship
};