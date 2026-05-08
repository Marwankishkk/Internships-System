const mongoose = require('mongoose');

const ApplicationSchema = mongoose.Schema({
    student :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    internship : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
        required: true,
    },
    status : {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    wishOrder : {
        type : Number,
        enum : [1,2,3],
        required: true

    }
},

{timestamps: true}
);
module.exports = mongoose.model('Application', ApplicationSchema);