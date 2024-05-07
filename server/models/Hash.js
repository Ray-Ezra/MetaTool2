const  mongoose = require ("mongoose")
const User = require("./User")

const hashSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    TXHash: {
        type: String,
        required: true
    },
    Wallet:{ 
        type: String,
        required: true
    },
    
},

 )
module.exports = mongoose.model('Hash', hashSchema)
