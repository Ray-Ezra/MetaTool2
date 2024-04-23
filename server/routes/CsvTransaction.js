const express = require('express')
const router = express.Router()
const authToken = require('../middleware/AuthMW')
const Csv = require('../models/Csv')
const Hash = require('../models/Hash')
const Currency = require('../models/Currency')
const RecipientData = require('../models/RecipientsData')
const Fees = require('../models/TransFees')
// import User from '../models/User'
// import Recipient from "./models/Recipient"

// import { Router } from "express"

router.get('/details',authToken ,  async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const verifiedData = await Csv.find({ User: loggedInUser, verified: true })
            .limit(1)
            .sort({ createdAt: -1 })
            .populate('Hash')
            .populate({
                path: 'Currency',
                model: 'Currency'
            })
            .populate('Fees')
            .populate({
                path: 'RecipientData',
                select: 'exchangeRates classification ',
                populate: {
                    path: 'classification',
                    select: 'classificationName'
                },
                
            })
            .populate({
                path: 'RecipientData',
                select: 'exchangeRates recipients ',
                populate: {
                    path: 'recipients',
                    select: 'name localCurrency'
                },
                
            })
            .exec();

        res.status(200).json({ success: true, verifiedData });
    } catch (error) {
        res.status(404).json({ success: false, error, message: "Data Doesn't exist!" });
    }
});

router.post('/addDetails', authToken, async (req, res, next) => {
    console.log('DATA:', req.body);
    try {
        const loggedInUser = req.user;
        const dataArray = req.body; // Assuming the array is named DATA

        const savedDetails = [];

        for (const data of dataArray) {
            const {
                localCurrencyName, localCurrencyAmount, localCurrencyUsdRate, localCurrencyUsdAmount,recipien,
                TXHash, Wallet, TxFee, TxPerRecipient,
                // TxPerRecipientUSD 
            } = data;

            const currency = new Currency({
                User: loggedInUser,
                recipien,
                localCurrencyName,
                localCurrencyAmount,
                localCurrencyUsdRate,
                localCurrencyUsdAmount
            });
            await currency.save();

            const hash = new Hash({ User: loggedInUser, TXHash, Wallet });
            await hash.save();

            const latestRecipientsData = await RecipientData.findOne({ User: loggedInUser }).sort({ createdAt: -1 }).exec();

            const fees = new Fees({
                User: loggedInUser,
                TxFee,
                TxPerRecipient,
                // TxPerRecipientUSD
            });
            await fees.save();

            const CsvDetails = new Csv({
                User: loggedInUser,
                Currency: currency._id,
                Hash: hash._id,
                RecipientData: latestRecipientsData._id,
                Fees: fees._id,
                verified: true
            });
            await CsvDetails.save();

            savedDetails.push(CsvDetails);
        }

        res.status(201).json({ success: true, data: savedDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});


// router.post('/addDetails',authToken , async (req, res, next) => {
//     console.log('DATA:',req.body)
//     try{
//         const loggedInUser = req.user
//         const {
//             localCurrencyName, localCurrencyAmount, localCurrencyUsdRate, localCurrencyUsdAmount,
//             TXHash, Wallet,TxFee, TxPerRecipient,
//             // TxPerRecipientUSD 
//          } = req.body

//         const currency = new Currency({
//             User: loggedInUser,
//             localCurrencyName,
//             localCurrencyAmount,
//             localCurrencyUsdRate,
//             localCurrencyUsdAmount
//           })
//           await currency.save()
         
//         const hash = new Hash({  User:loggedInUser, TXHash, Wallet})
//         await hash.save()
        
//         const latestRecipientsData = await RecipientData.findOne({ User: loggedInUser }).sort({ createdAt: -1 }).exec()

//         const fees = new Fees({
//             User:loggedInUser,
//             TxFee,
//             TxPerRecipient,
//             // TxPerRecipientUSD
//         })
//         await fees.save()
      
//         const CsvDetails = new Csv({
//             User: loggedInUser,
//             Currency: currency._id,
//             Hash:hash._id,
//             RecipientData:  latestRecipientsData._id,
//             Fees: fees._id,
//             verified:true

//         })
//         await CsvDetails.save()

//         // const totalUsdValue = 
//         //     localCurrencyAmount + TxPerRecipientUSD + (
//         //     latestRecipientsData.NCA_sent * latestRecipientsData.NCA_USD);

//         res.status(201).json({ success: true, data: CsvDetails, 
//         //    totalUsdValue
//          });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, error: "Internal Server Error" });
//     }
// });

module.exports = router;
