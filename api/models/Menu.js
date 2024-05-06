const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create schema object for menu items
const menuSchema = new Schema({

    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
    },
    description: {
        type: String, // Long description
        required: true,
    },
    recipe:String,
    image: String,
    backdropImages: [String],
    category: String,
    price: Number,
    likes: {
        type: Number,
        default: 0
    },
    likedByUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }],
    dislikedByUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }],

    starRatings: {
        type: Number,
        enum: [1, 2, 3, 4, 5], 
        default: 0 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Creating a model
const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
