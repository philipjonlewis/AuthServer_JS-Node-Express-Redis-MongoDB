const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");

const {
  userNameValidSchema,
  passwordValidSchema,
} = require("./validationSchemas");

const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

const editUsernameValidatorSchema = Joi.object({
  password: passwordValidSchema,
  passwordConfirmation: Joi.string().valid(Joi.ref("password")).required(),
  newUsername: userNameValidSchema,
});

exports.editUsernameValidator = asyncHandler(async (req, res, next) => {
  try {
    if (
      Object.keys(await req.body).toString() !==
      "newUsername,password,passwordConfirmation"
    ) {
      throw new ErrorHandler(422, "Unable to process improper data");
    }

    const { newUsername, password, passwordConfirmation } = await req.body;

    await editUsernameValidatorSchema
      .validateAsync(
        {
          password,
          passwordConfirmation,
          newUsername: sanitizeHtml(req.sanitize(newUsername.toLowerCase())),
        },
        {
          escapeHtml: true,
          abortEarly: false,
        }
      )
      .then(async (formResData) => {
        delete formResData.passwordConfirmation;
        res.locals.userCredentials = { ...formResData, isEmail: false };
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
  } catch (error) {
    throw new ErrorHandler(error.status, error.message, error?.payload);
  }
});
