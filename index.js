    require('dotenv').config();
    const express = require('express')
    const cors = require('cors');
    const config = require('config');

    const connectDB = require('./db/database');
    const app = express();

    app.use(cors({
        origin: '*', 
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'], 
        credentials: false 
    }));
    
    app.use(express.json());

    if (!config.get('jwt.secret')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }

    connectDB(); //connect to database

    //imports routes
    const todos = require('./routes/todos')
    const users = require('./routes/users')
    const auth = require('./routes/auth')
    
    app.use('/api/todos',todos)
    app.use('/api/users/signup',users)
    app.use('/api/login',auth)
    


    //PORT
    const port = process.env.PORT || 3000;
    app.listen(port,()=>console.log(`Listening On Port ${port}`))
