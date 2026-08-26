const mongoose = require('mongoose');

//User Schema
const userSchema = new mongoose.Schema({

    name:{
        type:String, 
        required:[true, 'User must have a name'],
    },
    email:{
        type:String,
        required:[true, 'User must have a email'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'User must have a password'],
        unique:true
    },
    tasksList:[
        {
            type:mongoose.Types.ObjectId,
            ref:'Task'
        }
    ]
}, {
    timestamps: true
})

//Create the model Task
const User = mongoose.model('User', userSchema);


module.exports = User;