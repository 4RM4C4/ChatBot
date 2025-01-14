require('dotenv').config()

const PORT = process.env.PORT || 3001
let MONGODB_URI = process.env.NODE_ENV === 'test'
? process.env.TEST_MONGODB_URI
: process.env.MONGODB_URI

const JWT_SECRET = process.env.JWT_SECRET

const COOKIE_SECRET = process.env.COOKIE_SECRET

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  COOKIE_SECRET
}