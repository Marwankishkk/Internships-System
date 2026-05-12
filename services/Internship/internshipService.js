const { create ,countByCompanyAndMajor,getRecommendedInternships,getInternshipById
} = require('../../repositories/Internship/internship');
const { getStudentByUserId,getCompanyByUserId } = require('../../repositories/User/user');
const {findApplicationsForInternship} = require('../../repositories/Application/application');
const {rankStudents} = require("../../utils/ranking.js");
const application = require('../../models/Application/application');
const internship = require('../../models/Internship/internship.js');

const createInternship = async (data,user) => {
    try {
        const { title, major, requiredGPA, city } = data;
        const company = await getCompanyByUserId({ user: user.userId });
        if (!company) {
            throw new Error('Company not found for this user');
        }
        const companyId = company._id;

        const count = await countByCompanyAndMajor(companyId, major);
        if (count >= 3) {
            return {message: "You have already created 3 internships for this major"};
        }

        
        const newInternship = await create({
            company: companyId,
            title,
            major,
            requiredGPA,
            city
        });
        await newInternship.populate({
            path: 'company',
            select: 'companyName'
        });
        return {newInternship}

    } catch (error) {
        console.error('Error creating internship:', error);
        return {message :"Failed to create internship: " + error.message};
    }
    
};

const getIntershipsForStudent = async (userData) => {
    let student;
    try {
    const userId = userData.userId;
    student = await getStudentByUserId( userId )
        .populate('user');
    }
    catch  (error) {
        return {message :"Failed to fetch user data: " + error.message};
    }
    try {

    const internships = await getRecommendedInternships(student.major,student.gpa);
    return {internships};
    }
    catch (error) {
        console.error('Error fetching internships:', error);
        return {message :"Failed to fetch internships: " + error.message};
    }

};

const getInternshipApplications = async (data,user) =>{
    try{
    const company = await getCompanyByUserId({ user: user.userId });
    const {internshipId} = data
    applications = await findApplicationsForInternship(internshipId)
    const ranking = await rankStudents(applications)
    return {ranking};
    }
    catch(error) {
        console.error('Error fetching applications:', error);
        return {message :"Failed to fetch applications: " + error.message};

    }

}
module.exports = { createInternship,getIntershipsForStudent ,getInternshipApplications };