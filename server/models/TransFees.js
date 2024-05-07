const  mongoose = require ("mongoose")
const User = require('./User')

const feesSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
   TxFee:{
    type: Number
   },
   TxPerRecipient: {
    type:Number
   },
   TxPerRecipientUSD: {
    type:Number
   },
   tokenChain:{
    type:String
   }

})
module.exports = mongoose.model('Fees', feesSchema)
