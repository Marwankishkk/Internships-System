const mongoose = require('mongoose');

const CompanySchema = mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,

    },
    companyName : {
        type: String,
        required: [true, 'Please provide company name'],
    },
    
    city : {
        type: String,
        required: [true, 'Please provide location'],
    },

},
{timestamps: true}
);

module.exports = mongoose.model('Company', CompanySchema);