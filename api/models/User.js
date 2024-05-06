const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Add this line
        trim: true,
        minlength: 3
    },
    photoUrl: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});


const User = mongoose.model('User',userSchema)
module.exports=User;