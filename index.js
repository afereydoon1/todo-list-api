    require('dotenv').config();
    const express = require('express')
    const Joi = require("joi");
    const connectDB = require('./db/database');
    const app = express();
    
    app.use(express.json());

    connectDB(); //connect to database

    //imports routes
    const todos = require('./routes/todos')
    
    app.use('/api/todos',todos)
    


    //PORT
    const port = process.env.PORT || 3000;
    app.listen(port,()=>console.log(`Listening On Port ${port}`))
