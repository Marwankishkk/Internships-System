const mongoose = require('mongoose');
const validator = require("validator");
const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
          validator: validator.isEmail,
          message: 'Invalid email format'
        }
      },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: [6, 'Password must be at least 6 characters'],
      },
    role : {
        type: String,
        enum: ['student', 'company'],
    },
},
{timestamps: true}
);

module.exports = mongoose.model('User', UserSchema);