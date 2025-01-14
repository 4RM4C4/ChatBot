const expressValidator = require('express-validator')
const express = require('express')

const singupValidator = [
  expressValidator.body("nombre").notEmpty().withMessage("Name is required"),
  expressValidator.body("email").trim().isEmail().withMessage("Email is required"),
  expressValidator.body("password").trim().isLength({ min: 6}).withMessage("Password should contain at leat 6 characters")
]

const loginValidator = [
  expressValidator.body("email").trim().isEmail().withMessage("Email is required"),
  expressValidator.body("password").trim().isLength({ min: 6}).withMessage("Password should contain at leat 6 characters")
]

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req)
    }
    const errors = expressValidator.validationResult(req)
    if(errors.isEmpty()) {
      return next()
    }
    return res.status(422).json( { errors: errors.array() })
  }
};

module.exports = {
  validate,
  singupValidator,
  loginValidator,
}