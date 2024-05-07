const mongoose = require('mongoose')
const Token = require(`../models/Token`)
const Description = require('../models/Description')
const Classification = require('../models/Classification')
const RecipientsData = require('../models/RecipientsData')
const User = require('../models/User')
const Recipient = require('../models/Recipient')
const Hash = require('../models/Hash')
const Crypto = require('../models/Crypto')

const fs = require('fs');
const path = require('path');
const util = require('util');
const Currency = require('../models/Currency')
const writeFile = util.promisify(fs.writeFile)

const NewTransactionController= {
    addRecipientTransaction: async (req, res) => {
        console.log('Controller received request:', req.body)
        try {

            const { //transactionName,transactionDescription ,
              // tokenName,
              descriptionName,
               classificationName,
               recipients: [...recipientData], 
               exchangeRates } = req.body
          //const user = req.user  
          //const TName = await RecipientsData.create({transactionName,})
           // const TDescription = await RecipientsData.create({transactionDescription,})
 
           const recipients = await Promise.all(
            recipientData.map(async (recipient) => {
              return await Recipient.create(recipient);
            })
          );

          /*const recipient = await Recipient.create({ //User:User,
            name,  org, comment, token1, amount1, token2,amount2 });
*/
// const tokens = await Promise.all(
//   tokenName.map(async ({ name, amount }) => {
//     return await Token.create({ tokenName: { name, amount } });
//   })
// )
          
            const description = await Description.create({descriptionName})
           // const token = await Token.create({tokenName, amount})
            const classification = await Classification.create({classificationName})
                
                const loggedInUser = req.user;

            const RecipientData = await RecipientsData.create({
                User: loggedInUser,
                // transactionName:transactionName,
                // transactionDescription:transactionDescription,
                classification,
                description,
                exchangeRates:exchangeRates,
                recipients,
                // token: tokens.map(token => token._id),
                verified: true,
            })
    
     res.status(201).json({success:true, RecipientData })       

} catch(error){
    console.error(error)
    res.status(500).json({success: false, error:"Internal Server Error"})
}
},
 getRecipientData:  async (req, res) => {
    try {
     console.log('Logged-in User:', req.user)
      const loggedInUser = req.user;
  
      // Fetch recipient data associated with the logged-in user from the database
      const userRecipientData = await RecipientsData.find({ 'User': loggedInUser._id })
      .populate({
        path: 'recipients',
        select: 'name'})
      .populate({
        path: 'classification',
        select: 'classificationName'})
      .populate({
        path: 'description',
        select: 'descriptionName'});

  
      // Return the data as a JSON response
      res.status(200).json({ success: true, transactions: userRecipientData, downloadLink: `/downloadRecipientData`});
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  },

  getDataById: async (req, res) =>  {
    try {
      const loggedInUser = req.user;
      const transactionId = req.params.id;
  
      // Check if the transactionId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        return res.status(400).json({ error: "Invalid transaction ID" });
      }
      const transaction = await RecipientsData.findById(transactionId).populate('recipients');
       if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json({ transactions: transaction, downloadLink: `/downloadRecipientData/${transactionId}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },


  downloadRData: async (req, res) => {
    try {
      console.log('Request Params:', req.params);
     
      const loggedInUser = req.user;
      const selectedTransctionId = req.params.selectedTransctionId
      console.log('Id :',selectedTransctionId)

      const userRecipientData = await RecipientsData.findById(selectedTransctionId);
    console.log(userRecipientData)

      const jsonData = JSON.stringify({ success: true, transactions: userRecipientData });
      console.log(jsonData)  

      // Create a unique filename for the downloaded file
      const filename = `recipient_data_${loggedInUser._id}_${Date.now()}.json`;
  
      const filePath = path.join(__dirname, 'downloads', filename);
       console.log(filePath)
       if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
        fs.mkdirSync(path.join(__dirname, 'downloads'));
    }
    
      await writeFile(filePath, jsonData, 'utf8');
  
      // Send the file as a response for download
      res.setHeader('Cache-Control', 'no-cache');

      res.sendFile(filePath, filename, (err) => {
        // Delete the file after it has been sent
        fs.unlinkSync(filePath);
        if (err) {
          console.error(err);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  },
  
  addHash: async (req, res) => {
  console.log("req:", req.body)
    try {
      const loggedInUser = req.user;
      const {TXHash, wallet } = req.body;
  
      if (!TXHash || !wallet) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      const user = await User.findById(loggedInUser);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const hash = new Hash({
        User: loggedInUser,
        TXHash,
        Wallet: wallet
      });
      await hash.save();
      res.status(201).json({ success: true, hash });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  LocalCurrency: async(req, res) => {
try{
  const loggedInUser = req.user
    const {LocalCurrency, LocalCurrencyAmount, LocalCurrencyUsdRate} = req.body
    const user = await User.findById(loggedInUser)
  if(!user){
    return res.status(404).json({error:'User not Found!'})
  }
  const currency = new Currency({
    User:loggedInUser,
    localCurrencyName:LocalCurrency,
    localCurrencyAmount: LocalCurrencyAmount ,
    localCurrencyUsdRate:LocalCurrencyUsdRate,
    localCurrencyUsdAmount: LocalCurrencyAmount * LocalCurrencyUsdRate
  })
  await currency.save()
  res.status(201).json({success:true, currency: currency})
}
catch(error){
console.error(error)
res.status(500).json({ error: 'Internal Server Error' });
}
  },
  addCrypto: async(req,res) => {
    try {
      const newCrypto = await Crypto.create(req.body);
      res.status(201).json(newCrypto);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
  }, 
  getCrypto: async(req, res) => {
    try {
      const cryptos = await Crypto.find({});
      res.status(200).json({data:cryptos});
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
  }
  

  /*downloadRData: async (req, res) => {
    try {
      console.log('req:',req.body)
      const loggedInUser = req.user;
      const selectedTransactionId = req.params.id; // Use the same parameter name as in getDataById
      console.log('id:',selectedTransactionId)

      // Check if the selectedTransactionId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(selectedTransactionId)) {
        return res.status(400).json({ error: "Invalid transaction ID" });
      }
  
      const userRecipientData = await RecipientsData.findById(selectedTransactionId);
  
      if (!userRecipientData) {
        return res.status(404).json({ error: "Recipient data not found" });
      }
  
      const jsonData = JSON.stringify({ success: true, transactions: userRecipientData });
      console.log('JD:',jsonData)
      const filename = `recipient_data_${loggedInUser._id}_${Date.now()}.json`;
  
      const filePath = path.join(__dirname, 'downloads', filename);
  
      if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
        fs.mkdirSync(path.join(__dirname, 'downloads'));
      }
  
      await writeFile(filePath, jsonData, 'utf8');
  
      res.setHeader('Cache-Control', 'no-cache');
  
      res.sendFile(filePath, filename, (err) => {
        fs.unlinkSync(filePath);
        if (err) {
          console.error(err);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }*/

}

module.exports = NewTransactionController