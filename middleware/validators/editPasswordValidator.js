const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");

const { passwordValidSchema } = require("./validationSchemas");

const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

const editPasswordValidatorSchema = Joi.object({
  newPassword: passwordValidSchema,
  newPasswordConfirmation: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required(),
  existingPassword: passwordValidSchema,
  existingPasswordConfirmation: Joi.string()
    .valid(Joi.ref("existingPassword"))
    .required(),
});

exports.editPasswordValidator = asyncHandler(async (req, res, next) => {
  if (
    Object.keys(await req.body).toString() !==
    "newPassword,newPasswordConfirmation,existingPassword,existingPasswordConfirmation"
  ) {
    throw new ErrorHandler(422, "Unable to process improper data");
  }
  const {
    newPassword,
    newPasswordConfirmation,
    existingPassword,
    existingPasswordConfirmation,
  } = await req.body;

  await editPasswordValidatorSchema
    .validateAsync(
      {
        newPassword,
        newPasswordConfirmation,
        existingPassword,
        existingPasswordConfirmation,
      },
      {
        escapeHtml: true,
        abortEarly: false,
      }
    )
    .then(async (formResData) => {
      delete formResData.newPasswordConfirmation;
      delete formResData.existingPasswordConfirmation;
      res.locals.userCredentials = { ...formResData };
      return next();
    })
    .catch(async (error) => {
      const logInValidatorErrors = error.details.map((err) => {
        return err.path[0];
      });
      throw new ErrorHandler(
        409,
        "There seems to be something wrong with the following fields",
        logInValidatorErrors
      );
    });
});
