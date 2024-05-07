const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     required: true,
    //     min: 3,
    //     max: 20,
    //     unique: true
    // }
    email: {
        type: String,
        required: true,
        max: 20,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    roles: [{
        type: String,
        default: "Employee"
    }],
    active: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: true
    }

})

module.exports = mongoose.model('User', userSchema)