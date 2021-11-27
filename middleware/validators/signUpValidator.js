const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");
// const { escape, unescape } = require('html-escaper');

const {
  emailValidSchema,
  passwordValidSchema,
  passwordValidSchemaConfirmation,
} = require("./validationSchemas");

const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

const signUpValidatorSchema = Joi.object({
  email: emailValidSchema,
  password: passwordValidSchema,
  passwordConfirmation: passwordValidSchemaConfirmation,
});

exports.signUpValidator = asyncHandler(async (req, res, next) => {
  try {
    if (
      Object.keys(await req.body).toString() !==
      "_csrf,email,password,passwordConfirmation"
    ) {
      throw new ErrorHandler(422, "Unable to process improper data");
    }
    const { email, password, passwordConfirmation } = await req.body;

    await signUpValidatorSchema
      .validateAsync(
        {
          email: sanitizeHtml(req.sanitize(await email)),
          password,
          passwordConfirmation,
        },
        {
          escapeHtml: true,
          abortEarly: false,
        }
      )
      .then((formResData) => {
        delete formResData.passwordConfirmation;
        res.locals.userCredentials = { ...formResData, isEmail: true };
        return next();
      })
      .catch(async (error) => {
        throw new ErrorHandler(
          409,
          "There seems to be something wrong with the following fields",
          await error.details.map((err) => {
            return err.path[0];
          })
        );
      });
  } catch (error) {
    throw new ErrorHandler(error.status, error.message, error?.payload);
  }
});
