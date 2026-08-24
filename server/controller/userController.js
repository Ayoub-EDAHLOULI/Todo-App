const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


//Register
const register = async (req, res) => {
    try{
        const {name, email, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save();
        
        res.status(201).json({
            message :  "User created successfully"
        })

    }catch(err){
        res.status(400).json({message : "User Already Exists"})
    }
}



//Login
const login = async (req, res) => {

    try{
        const {email, password} = req.body
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                message:"Please Sign Up First"
            })
        }

        const validPass = await bcrypt.compare(password, user.password)

        if(!validPass){
            return res.status(400).json({
                message:"Password Is Not Correct"
            })
        }

        const token = jwt.sign({data : email}, "secret", { expiresIn: '1h' })

        res.status(200).json({
            message :  "You Logged Successfully",
            token
        })


    }catch(err){
        res.status(500).json({
            message : 'Error logging in User not found'
        })
    }
}

module.exports = {register, login}