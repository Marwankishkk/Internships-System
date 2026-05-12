const { getStudentByUserId } = require('../../repositories/User/user');
const { create, countByStudent, findOne } = require('../../repositories/Application/application');
const { getInternshipMajor } = require('../../repositories/Internship/internship');

const createApplicationService = async (data, user) => {
    try {
        const student = await getStudentByUserId(user.userId);
        if (!student) {
            throw new Error('Student not found');
        }

        const { internshipId, wishOrder } = data;

        const studentMajor = student.major;
        let internshipMajor = await getInternshipMajor(internshipId);
        internshipMajor = internshipMajor.major
        if (studentMajor !== internshipMajor) {
            throw new Error('You must apply to your major');
        }

        if (![1, 2, 3].includes(wishOrder)) {
            throw new Error('wishOrder must be 1, 2, or 3');
        }
        

        const count = await countByStudent(student._id);
        if (count >= 3) {
            throw new Error('You can only apply to 3 internships');
        }

        const existingInternship = await findOne({
            student: student._id,
            internship: internshipId
        });

        if (existingInternship) {
            throw new Error('Already applied to this internship');
        }

        const existingWish = await findOne({
            student: student._id,
            wishOrder
        });

        if (existingWish) {
            throw new Error('This wish order is already used');
        }

        const newApplication = await create({
            student: student._id,
            internship: internshipId,
            wishOrder
        });

        return {newApplication};

    } catch (error) {
        console.error('Error creating application:', error);
        return {
            message: "Failed to create application",
            error: error.message
        };
    }
};

module.exports = { createApplicationService };