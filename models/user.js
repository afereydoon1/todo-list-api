const mongoose = require('mongoose');
// Todo model
const Joi = require("joi");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        unique:true
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024
    }

},{ timestamps: true });

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    })
    return schema.validate(user)
}

module.exports = {
    User,
    validateUser
}