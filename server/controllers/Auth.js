const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const TokenBlacklist = require('../models/TokenBlacklist')

// @desc Get all users
// @route GET /users
// @access Private/Admin


// @desc Create new user
// @route POST /users
// @access Private
const RegisterNewUser = asyncHandler(async (req, res) => {
    const {email ,password } = req.body

    // Confirm data
    if (!email ||!password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { email, "password": hashedPwd}

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${email} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

//Login

const LoginUser = asyncHandler(async (req, res) => {
   
    try{
        const { email ,password } = req.body
        const user = await User.findOne({ email }).exec()
    // Confirm data
    if ( !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

     if (!user) {
        return res.status(401).json({ status: 401, message: 'Invalid email' });
    }
else if(!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ status: 401, message: 'Invalid password' });
    }
    
const token = jwt.sign({
    _id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
    roles: user.roles,
}, process.env.JWT_SECRET) 
res.json({
    success:true,
    message:'Login successful',
    token
})
}catch(error){
    console.error("Error logging in:",error.message)
    res.status(500).json({success:false,error:'Internal Server Error'})
}
})

//Logout
const LogoutUser = asyncHandler(async (req, res) => {
    const {token} = req.body
    if(!token){
        return res.status(400).json({ success:false, error:'Token required for logout'})
    }
    try{
        const isTokenBlaclisted = await TokenBlacklist.exists({token})
        if(isTokenBlaclisted){
            return res.status(400).json({success:false,error:'Token is already invalid'})
        }
        await TokenBlacklist.create({token})

        res.status(200).json({success:true, message:'Logout successful'})

    }
    catch(error){
        console.error("Error logging out:",error.message)
        res.status(500).json({success:false, error:'Internal Server Error'})
    }
});



module.exports =exports = {
    RegisterNewUser,
    LoginUser,
    LogoutUser
}