const mongoose = require('mongoose');


const InternshipSchema = mongoose.Schema({
    company :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    title : {
        type: String,
        required: [true, 'Please provide internship title'],
    },
    
    major: {
        type: String,
        required: true,
        enum: ['CS', 'AI', 'IS', 'SE', 'IT']
      },

    requiredGPA : {
        type: Number,
        required: [true, 'Please provide required GPA'],
        min: 0,
        max: 4
    },
    city : {
        type: String,
        required: [true, 'Please provide internship location'],
    },


},
{timestamps: true}
);

module.exports = mongoose.model('Internship', InternshipSchema);