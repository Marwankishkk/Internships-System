const rankStudents = async (applications) => {

    const rankedApplications = applications.map((app) => {

        let score = 0;

     
        score += (4 - app.wishOrder) * 20;

        score += app.student.gpa * 10;

        return {
            applicationId: app._id,
            studentId: app.student._id,
            studentName: app.student.name,
            major: app.student.major,
            gpa: app.student.gpa,
            wishOrder: app.wishOrder,
            finalScore: score
        };
    });

    rankedApplications.sort((a, b) => b.finalScore - a.finalScore);

    const finalRanking = rankedApplications.map((app, index) => ({
        rank: index + 1,
        ...app
    }));

    return finalRanking;
};

module.exports = {rankStudents}