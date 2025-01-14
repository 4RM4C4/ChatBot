const expressValidator = require('express-validator')
const express = require('express')

const singupValidator = [
  expressValidator.body("nombre").notEmpty().withMessage("Nombre is required"),
  expressValidator.body("email").trim().isEmail().withMessage("Email is required"),
  expressValidator.body("password").trim().isLength({ min: 6}).withMessage("Password should contain at leat 6 characters")
]

const loginValidator = [
  expressValidator.body("email").trim().isEmail().withMessage("Email is required"),
  expressValidator.body("password").trim().isLength({ min: 6}).withMessage("Password should contain at leat 6 characters")
]

const menuValidator = [
  expressValidator.body("nombre").notEmpty().withMessage("Nombre is required"),
  expressValidator.body("categoria").trim().notEmpty().withMessage("Categoria is required"),
  expressValidator.body("ingredientes").isArray({ min: 1 }).withMessage("Ingredientes must be a non-empty array").bail().custom((array) => array.every((item) => typeof item === 'string')).withMessage("Each ingrediente must be a string"),
]

const menuDeleteValidator = [
  expressValidator.body("nombre").notEmpty().withMessage("Nombre is required")
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
  menuValidator,
  menuDeleteValidator
}