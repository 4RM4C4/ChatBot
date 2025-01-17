const jwt = require('jsonwebtoken')
const config = require('./config')

const createToken = (id, email, admin, expiresIn) => {
  const payload = { id, email, admin}
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
        resolve()
        res.locals.jwtData = success;
        return next()
      }
    })
  })
}

const isAdmin = async (req, res, next) => {
  console.log(res.locals.jwtData)
  if(!res.locals.jwtData.admin){
    return res.status(401).json({message: "User not admin"})
  }
  return next()
}

module.exports = { createToken, verifyToken, isAdmin }