const express = require('express')
const router = express.Router()
const Recipient = require('../models/Recipient');
const NewTransactionController = require('../controllers/Transaction');
//const User = require('../models/User');

//Add recipient route
router.post('/addRecipient', async (req, res, next) => {
    try {
        const { name, org, comment, token1, amount1, token2,amount2 } = req.body;
        const recipient = await Recipient.create({ //User:User,
             name,  org, comment, token1, amount1, token2,amount2 });

    // const recipientId = recipient._id
    // req.body.recipientId = recipientId
    //await NewTransactionController.addRecipientTransaction(req, res)

        res.json({ success: true, recipient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router