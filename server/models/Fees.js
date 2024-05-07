const  mongoose = require ("mongoose")
const Classification = require("./Classification")
const User = require("./User")

const feesSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    TXFee: {
        type: Number,
        required: true
    },
    classification:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Classification
    },
    
},

 )
module.exports = mongoose.model('Fees', feesSchema)