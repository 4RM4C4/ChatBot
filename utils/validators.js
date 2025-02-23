const expressValidator = require('express-validator')
const express = require('express')

const signUpValidator = [
  expressValidator.body("nombre").notEmpty().withMessage("nombre is required").isString().withMessage('nombre must be a string'),
  expressValidator.body("email").trim().isEmail().withMessage("Email is required"),
  expressValidator.body("password").trim().isLength({ min: 6}).withMessage("Password should contain at leat 6 characters")
]

const loginValidator = [
  expressValidator.body("email").trim().isEmail().withMessage("Email is required"),
  expressValidator.body("password").trim().isLength({ min: 6}).withMessage("Password should contain at leat 6 characters")
]

const menuValidator = [
  expressValidator.body("nombre").notEmpty().withMessage("nombre is required").isString().withMessage('nombre must be a string'),
  expressValidator.body("categoria").trim().notEmpty().withMessage("Categoria is required"),
  expressValidator.body("ingredientes").isArray({ min: 1 }).withMessage("Ingredientes must be a non-empty array").bail().custom((array) => array.every((item) => typeof item === 'string')).withMessage("Each ingrediente must be a string"),
]

const menuDeleteValidator = [
  expressValidator.body("nombre").notEmpty().withMessage("nombre is required").isString().withMessage('nombre must be a string')
]

const patchValidator = [
  expressValidator.body("nombre").optional().isString().withMessage('nombre must be a string'),
  expressValidator.body("email").optional().trim().isEmail().withMessage("email is required"),
  expressValidator.body('admin').optional().isBoolean().withMessage('admin must be a boolean value'),
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
  signUpValidator,
  loginValidator,
  menuValidator,
  menuDeleteValidator,
  patchValidator
}