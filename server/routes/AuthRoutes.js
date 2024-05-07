const express = require('express')
const router = express.Router()
const {RegisterNewUser,LoginUser, LogoutUser} = require('../controllers/Auth')

router.post('/Register',RegisterNewUser)
router.post('/Login',LoginUser)
router.post('/Logout',LogoutUser)

module.exports = router