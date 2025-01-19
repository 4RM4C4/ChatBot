require('dotenv').config()

const PORT = process.env.PORT || 3001
let MONGODB_URI = process.env.NODE_ENV === 'dev'
? process.env.DEV_MONGODB_URI
: process.env.MONGODB_URI

const JWT_SECRET = process.env.JWT_SECRET

const COOKIE_SECRET = process.env.COOKIE_SECRET

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN

const COOKIE_NAME = process.env.COOKIE_NAME

const HUGGINGFACE_KEY = process.env.HUGGINGFACE_KEY

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  COOKIE_SECRET,
  COOKIE_DOMAIN,
  COOKIE_NAME,
  HUGGINGFACE_KEY
}