const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with your API key
sgMail.setApiKey('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');

// Generate and send OTP to the user's email
router.post('/generate-otp', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const otp = speakeasy.totp({
    secret: speakeasy.generateSecret({ length: 20 }).base32,
    encoding: 'base32'
  });

  // Send OTP to user's email using SendGrid
  const msg = {
    to: email,
    from: 'raymondezra276@gmail.com',
    subject: 'Your OTP for Login',
    text: `Your OTP (One-Time Password) for login is: ${otp}`,
  };

  sgMail.send(msg)
    .then(() => {
      console.log('OTP sent to', email);
      res.status(200).json({
        message: 'OTP generated and sent successfully to your email',
        otp: otp
      });
    })
    .catch((error) => {
      console.error('Error sending OTP:', error);
      res.status(500).json({ error: 'Failed to send OTP via email' });
    });
});

module.exports = router;
