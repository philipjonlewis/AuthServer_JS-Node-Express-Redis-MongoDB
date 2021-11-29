const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");

const {
  emailValidSchema,
  passwordValidSchema,
} = require("./validationSchemas");

const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

const editUsernameValidatorSchema = Joi.object({
  password: passwordValidSchema,
  passwordConfirmation: Joi.string().valid(Joi.ref("password")).required(),
  newEmail: emailValidSchema,
});

exports.editEmailValidator = asyncHandler(async (req, res, next) => {
  try {
    if (
      Object.keys(await req.body).toString() !==
      "_csrf,newEmail,password,passwordConfirmation"
    ) {
      throw new ErrorHandler(422, "Unable to process improper data");
    }

    const { newEmail, password, passwordConfirmation } = await req.body;

    await editUsernameValidatorSchema
      .validateAsync(
        {
          password,
          passwordConfirmation,
          newEmail: sanitizeHtml(req.sanitize(await newEmail)),
        },
        {
          escapeHtml: true,
          abortEarly: false,
        }
      )
      .then(async (formResData) => {
        delete formResData.passwordConfirmation;
        res.locals.userCredentials = { ...formResData, isEmail: true };
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
