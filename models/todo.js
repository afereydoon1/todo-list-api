const mongoose = require('mongoose');
// Todo model
const Joi = require("joi");
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    description:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress','done'],
        default: 'pending'
    }
    
},{ timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

function validateTodo(todo) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(5).max(200).required(),
        status: Joi.string().valid('pending', 'in-progress','done')
    })
    return schema.validate(todo)
}

module.exports = {
    Todo,
    validateTodo
}