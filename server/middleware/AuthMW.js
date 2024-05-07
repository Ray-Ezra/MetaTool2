const jwt = require('jsonwebtoken')
//const expressJwt = require('express-jwt')

const secretKey = process.env.JWT_SECRET

const authToken = (req, res, next) => {
    const token = req.header('Authorization')
    if(!token) return res.status(401).json({success: false, message:'Access denied. Token not provided.'})

    jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
        if(err) return res.status(401).json({success: false, message:'Access denied. Invalid token.'})
        req.user = user
        if (!user.isAdmin){
            return res.status(403).json({success: false, message:"Access denied. Administrator privileges required."})
        }
        next()
    })
}


/*const auth = expressJwt({
    secret: secretKey,
    algorithms: ['HS256'],
    userProperty: 'auth'
})
const { isAdmin } = req.user;
    if (!isAdmin) {
      return res.status(403).json({ success: false, error: 'Access denied. Admin privileges required.' });
    }
*/

module.exports = authToken