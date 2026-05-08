
const Internship = require('../../models/Internship/internship');
const Company = require('../../models/Auth/Company');
const create = async (data) => {
    return await Internship.create(data);
}
const countByCompanyAndMajor = async (companyId, major) => {
    return await Internship.countDocuments({
        company: companyId,
        major
    });
};
const getRecommendedInternships =async (major, gpa) => {
    return await Internship.find({
        major,
        requiredGPA: { $lte: gpa }
    }).populate('company', 'companyName city');
};
const getInternshipById = async (id) => {
    return await Internship.findById(id).populate('company');
}
const getInternshipMajor = async(id) => {
    return await Internship.findById(id).select('major');
}
module.exports = {
    create,
    countByCompanyAndMajor,
    getRecommendedInternships,
    getInternshipById,
    getInternshipMajor
}
