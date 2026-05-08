const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,

    },
    nationalId: {
        type: String,
        required: [true, 'Please provide national ID'],
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{14}$/.test(v);
            },
            message: 'National ID must be exactly 14 digits'
        }
    },
    name : {
        type: String,
        required: [true, 'Please provide name'],
    },
    major: {
        type: String,
        required: true,
        enum: ['CS', 'AI', 'IS', 'SE', 'IT']
      },
    gpa : {
        type: Number,
        required: [true, 'Please provide GPA'],
        min: 0,
        max: 4
    },
    city : {
        type: String,
        required: [true, 'Please provide city'],
    },
    bio : {
        type: String,
        required: [true, 'Please provide bio'],
    },
    },
    {timestamps: true}
);
module.exports = mongoose.model('Student', StudentSchema);

