const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");
const { emailValidSchema } = require("./validationSchemas");

const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

const emailValidatorSchema = Joi.object({
  email: emailValidSchema,
});

exports.emailValidator = asyncHandler(async (req, res, next) => {
  try {
    if (Object.keys(await req.body).toString() !== "email") {
      throw new ErrorHandler(422, "Unable to process improper data");
    }
    const { email } = await req.body;

    await emailValidatorSchema
      .validateAsync(
        {
          email: sanitizeHtml(req.sanitize(email.toLowerCase())),
        },
        {
          escapeHtml: true,
          abortEarly: false,
        }
      )
      .then(async (formResData) => {
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
