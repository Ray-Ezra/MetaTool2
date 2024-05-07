const  mongoose = require ("mongoose")

const cryptoSchema = new mongoose.Schema({
   
    Name: {
        type: String,
        required: true
    },
    Network:{
        type: String,
        required:true
    },
    NCA:{
        type:Boolean,
        default:false
    },
    Stablecoin:{
        type:Boolean,
        default:true
    }
    
},

 )
module.exports = mongoose.model('Crypto', cryptoSchema)