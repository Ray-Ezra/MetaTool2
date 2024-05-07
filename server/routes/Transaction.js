const express = require('express')
const router = express.Router()
const Recipient = require('../models/Recipient')
const RecipientsData = require("../models/RecipientsData")
const Token = require('../models/Token')
const Description = require('../models/Description')
const authToken = require('../middleware/AuthMW')
const { sanitizeFilter } = require('mongoose')
//const { route } = require('./root')


// Admin verification of data
router.post('/verifyData', async (req, res, next) => {
  try {
    const { recipientsDataId } = req.body;
    const user = req.user;

    const updatedRecipientsData = await RecipientsData.findOneAndUpdate(
      { _id: recipientsDataId, 'User': user },
      { $set: { verified: true } },
      { new: true }
    );

    if (!updatedRecipientsData) {
      return res.status(404).json({ success: false, error: 'Recipient Data not found' });
    }

    res.status(201).json({ success: true, recipientsData: updatedRecipientsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.post('/generateJson', authToken, async (req, res, next) => {
  try {
    const user = req.user;
    const verifiedData = await RecipientsData.find({ User: user, verified: true })
      .limit(1)
      .sort({ createdAt: -1 })
      .populate('classification token description recipients');

    if (verifiedData.length === 0) {
      return res.status(404).json({ success: true, error: 'No verified data found', data: [] });
    }

    // Function to recursively remove "_id" and "__v" fields from an object
    const removeIdFields = (obj) => {
      if (obj && typeof obj.toObject === 'function') {
        obj = obj.toObject(); // Convert Mongoose document to plain object
      }

      const sanitizedObj = { ...obj };
      delete sanitizedObj._id;
      delete sanitizedObj.__v;

      // Recursively remove "_id" and "__v" fields from nested objects
      Object.keys(sanitizedObj).forEach((key) => {
        if (sanitizedObj[key] && typeof sanitizedObj[key] === 'object') {
          sanitizedObj[key] = removeIdFields(sanitizedObj[key]);
        }
      });

      return sanitizedObj;
    };

   // Function to remove the keys "0" and "tokenName" from the token object
// Function to remove the keys "0" and "tokenName" from each token in the token object
// Function to remove unnecessary fields from the token object
// const removeTokenKeys = (token) => {
//   if (token && typeof token === 'object') {
//       const cleanedToken = {};

//       // Iterate over each token
//       Object.keys(token).forEach(key => {
//           const tokenData = token[key];
//           if (tokenData && typeof tokenData === 'object') {
//               // Remove the "_id" and "__v" fields
//               delete tokenData._id;
//               delete tokenData.__v;

//               // Extracting name and amount from tokenName
//               const tokenName = tokenData.tokenName && tokenData.tokenName[0];
//               if (tokenName && typeof tokenName === 'object') {
//                   cleanedToken[key] = {
//                       name: tokenName.name,
//                       amount: tokenName.amount
//                   };
//               }
//           }
//       });

//       return cleanedToken;
//   }
//   return token;
// };


    // Convert data to the desired JSON structure
    const structuredData = verifiedData.map(item => {
      // const recipients = item.recipients.map(recipient =>  removeIdFields(recipient));
    const recipients = item.recipients.map(recipient => {
    const cleanedRecipient = removeIdFields(recipient);
    //cleanedRecipient.token =  removeTokenKeys(item.token)//item.token.map(removeIdFields);
    return cleanedRecipient;
}); 


// Function to remove the keys "0" and "tokenName" from the token object



   const classificationString = removeIdFields(item.classification.classificationName) 
   const descriptionString = removeIdFields(item.description.descriptionName)
      return {
        classification:Object.values(classificationString).join(''),
        description: Object.values(descriptionString).join('') ,
        exchangeRates: item.exchangeRates, // Assuming exchangeRates is not an array
        recipients,
        verified: item.verified,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString()
      };
    });

    // Generate JSON file content
    const jsonContent = JSON.stringify(structuredData, null, 2);

    res.set('Content-Type', 'application/json');
    res.attachment('metadata.json');
    res.send(jsonContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Endpoint to generate JSON file
// router.post('/generateJson', authToken, async (req, res, next) => {
//   try {
//     const user = req.user;
//     const verifiedData = await RecipientsData.find({ User: user, verified: true })
//       .limit(1)
//       .sort({ createdAt: -1 })
//       .populate('classification token description recipients');

//     if (verifiedData.length === 0) {
//       return res.status(404).json({ success: true, error: 'No verified data found', data: [] });
//     }

//     // Function to recursively remove "_id" and "__v" fields from an object
//     const removeIdFields = (obj) => {
//       if (obj && typeof obj.toObject === 'function') {
//         obj = obj.toObject(); // Convert Mongoose document to plain object
//       }

//       const sanitizedObj = { ...obj };
//       delete sanitizedObj._id;
//       delete sanitizedObj.__v;

//       // Recursively remove "_id" and "__v" fields from nested objects
//       Object.keys(sanitizedObj).forEach((key) => {
//         if (sanitizedObj[key] && typeof sanitizedObj[key] === 'object') {
//           sanitizedObj[key] = removeIdFields(sanitizedObj[key]);
//         }
//       });

//       return sanitizedObj;
//     };

//     // Convert data to the desired JSON structure
//     const structuredData = verifiedData.map(item => {
//       const recipients = item.recipients.map(recipient => removeIdFields(recipient));
//       const token = item.token.map(token => removeIdFields(token));

//       return {
//         classification: removeIdFields(item.classification),
//         description: removeIdFields(item.description),
//         exchangeRates: item.exchangeRates, // Assuming exchangeRates is not an array
//         recipients,
//         token,
//         verified: item.verified,
//         createdAt: item.createdAt.toISOString(),
//         updatedAt: item.updatedAt.toISOString()
//       };
//     });

//     // Generate JSON file content
//     const jsonContent = JSON.stringify(structuredData, null, 2);

//     res.set('Content-Type', 'application/json');
//     res.attachment('metadata.json');
//     res.send(jsonContent);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// });



module.exports = router;
