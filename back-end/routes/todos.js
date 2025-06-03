const auth = require("../middelware/auth")
const Joi = require("joi");
const {validateTodo,Todo} = require("../models/todo")
const express = require('express')
const router = express.Router();


router.get('/',auth,async (req,res)=>{
    const todos = await Todo.find({ user: req.user._id }).sort('-createdAt');
    res.send(todos);
})

router.post('/',auth, async (req, res) => {
    const { error } = validateTodo(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    try {
        // Create a new Todo instance
        const todos = new Todo({ title: req.body.title ,description:req.body.description,user: req.user._id});
        await todos.save();
        // Send the created Todo back to the client
        res.status(201).send(todos);
    } catch (err) {
        console.error('Error saving todos:', err.message);
        res.status(500).send('Something went wrong while saving the todos.');
    }
})

// Update an existing Todo
router.put('/:id',auth,async (req, res) => {
    const { error } = validateTodo(req.body);

    // If validation fails, return error message
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        // Find the Todo by ID and update with validated data
        const todos = await Todo.findByIdAndUpdate({ _id: req.params.id, user: req.user._id }, { title: req.body.title ,description:req.body.description,status:req.body.status}, { new: true });

        // If the todos does not exist, return a 404 error
        if (!todos) {
            return res.status(404).send('The todos with the given ID does not exist');
        }

        // Send the updated todos back to the client
        res.send(todos);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});


// This route is used to update only the 'status' field of a specific Todo item
router.patch('/:id/status',auth, async (req, res) => {
    // Validate only the 'status' field
    const schema = Joi.object({
        status: Joi.string().valid('pending', 'in-progress', 'done').required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
           const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { status: req.body.status },
            { new: true }
           );

        if (!todo) return res.status(404).send('The Todo with the given ID does not exist');
        res.send(todo);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});


// Delete a Todo
router.delete('/:id', async (req, res) => {
    try {
        // Find the Todo by ID and remove
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        // If the todo does not exist, return a 404 error
        if (!todo) {
            return res.status(404).send('The todo with the given ID does not exist');
        }

        // Send the deleted todo back to the client
        res.send(todo);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router