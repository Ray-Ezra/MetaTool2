const  mongoose = require ("mongoose")
const User = require('./User')

const classificationSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    classificationName:{
        type: String
    }

})
module.exports = mongoose.model('Classification', classificationSchema)