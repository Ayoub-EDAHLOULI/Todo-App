const express = require('express');
const app = express()
const taskRouter = require('./routers/tasksRouter');
const userRouter = require('./routers/userRouter')
app.use(express.json())


//Tasks Router
app.use('/api/v1', taskRouter);


//Users Auth
app.use('/api/v1', userRouter);


module.exports = app;