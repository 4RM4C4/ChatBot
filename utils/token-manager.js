const jwt = require('jsonwebtoken')
const config = require('./config')

const createToken = (id, email, expiresIn) => {
  const payload = { id, email}
  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: "1d"} )
  return token
}

const verifyToken = async (req, res, next) => {
  const token = req.signedCookies["auth_token"]
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token not received"})
  }
  return new Promise( (resolve, reject) => {
    return jwt.verify(token, config.JWT_SECRET, (err, success) => {
      if (err) {
        reject(err.message);
        return res.status(401).json({message: "Token expired"})
      } else {
        console.log("Token verification ok")
        resolve()
        res.locals.jwtData = success;
        console.log(res.locals.jwtData)
        return next()
      }
    })
  })
}

module.exports = { createToken, verifyToken }