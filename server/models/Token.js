const  mongoose = require ("mongoose")
const User = require('./User')

const tokenSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    tokenName: [
        {
          name: { type: String, required: true },
          amount: { type: Number, required: true },
          assetID: {type: String}
        }
      ]

})
module.exports = mongoose.model('Token', tokenSchema)
