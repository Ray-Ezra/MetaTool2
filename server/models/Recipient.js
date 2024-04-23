const  mongoose = require ("mongoose")
const User = require("./User")
const Token = require("./Token")

const recipientSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    name: {
        type:String
    },
    org:{
        type:String
    },
    wallet:{
        type:String
    },
    comment:{
        type:String
    },
    // token:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: Token
    // }],
    token1:{
        type: String
    },
    amount1:{
        type: String
    },
    token2:{
        type: String
    },
    amount2:{
        type: String
    },
   localCurrency:{
        type: Number
    },
},

 )
module.exports = mongoose.model('Recipient', recipientSchema)
