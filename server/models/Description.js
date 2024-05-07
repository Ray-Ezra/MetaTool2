const  mongoose = require ("mongoose")
const User = require('./User')

const descriptionSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    descriptionName:{
        type: String
    }

})
module.exports = mongoose.model('Description', descriptionSchema)