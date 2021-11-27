const Joi = require("joi");

exports.userNameValidSchema = Joi.string()
  .alphanum()
  .lowercase()
  .trim()
  .min(6)
  .max(32)
  .required();

exports.emailValidSchema = Joi.string()
  .lowercase()
  .trim()
  .min(3)
  .max(256)
  .email({ minDomainSegments: 2, tlds: { allow: false } })
  .required();

exports.passwordValidSchema = Joi.string()
  .trim()
  .min(6)
  .max(32)
  .pattern(new RegExp("(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,32}$"))
  .required();

exports.passwordValidSchemaConfirmation = Joi.string()
  .valid(Joi.ref("password"))
  .required();
