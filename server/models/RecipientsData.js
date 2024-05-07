const  mongoose = require ("mongoose")
const Recipient = require("./Recipient")
const Token = require("./Token")
const Description = require("./Description")
const Classification = require("./Classification")
const User = require("./User")

const exchangeRateSchema = new mongoose.Schema({
  
    base_currency: {
      type: String,
    },
    quote_currency: {
      type: String,
    },
    rate: {
      type: String,
    },
    time: {
      type: String,
    },
    stablecoin:{
      type:Boolean,
      default:true
    },
    stablecoinUSD:{
     type:Number
    },
    stablecoinSent:{
      type: Number
    },
    NCA:{
      type:Boolean,
      default:false
    },
    NCAUSD:{
      type:Number
     },
     NCASent:{
      type: Number
     },
     recipien:{
      type: String
  },
  });


const recipientDataSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    // transactionName: {
    //     type:String
    // },
    //  transactionDescription: {
    //     type:String
    // },

    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Recipient
    }],
    name: {
        type:String
    },
    token:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: Token
    }],
    description:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Description
    },
    classification:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Classification
    },
    exchangeRates:[exchangeRateSchema],
    verified: {
        type: Boolean,
        default: false, 
      }
    
},
{
    timestamps: true
}
)
module.exports = mongoose.model('RecipientData', recipientDataSchema)