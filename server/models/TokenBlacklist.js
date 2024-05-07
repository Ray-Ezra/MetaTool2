const mongoose = require('mongoose')

const tokenBlaclistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires:3600
    }
})

module.export = mongoose.model('TokenBlacklist', tokenBlaclistSchema)


