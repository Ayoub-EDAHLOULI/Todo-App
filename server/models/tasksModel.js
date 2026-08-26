const mongoose = require('mongoose');

//Task Schema
const taskSchema = new mongoose.Schema({ 
    task:{
        type:String,
        required:[true,'Please provide the task'],
        unique:false
    },
    completed:{
        type:Boolean,
        default:false
    },
    taskOwner:[
        {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    ]
}, {
    timestamps: true
})

//Create the model Task
const Task = mongoose.model('Task',taskSchema);


module.exports = Task;