const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");
// const { escape, unescape } = require('html-escaper'); - Escape when sending out data
const {
  userNameValidSchema,
  passwordValidSchema,
  emailValidSchema,
} = require("./validationSchemas");

const { asyncHandler } = require("../handlers/asyncHandler");
const ErrorHandler = require("../handlers/errorHandler");

const logInValidatorSchema = Joi.object({
  email: emailValidSchema,
  password: passwordValidSchema,
});

exports.logInValidator = asyncHandler(async (req, res, next) => {
  try {
    if (Object.keys(await req.body).toString() !== "_csrf,email,password") {
      throw new ErrorHandler(422, "Unable to process improper data");
    }

    const { email, password } = await req.body;

    await logInValidatorSchema
      .validateAsync(
        {
          email: sanitizeHtml(req.sanitize(await email)),
          password,
        },
        {
          escapeHtml: true,
          abortEarly: false,
        }
      )
      .then((formResData) => {
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
    console.log(error);

    throw new ErrorHandler(error.status, error.message, error?.payload);
  }

  // if (
  //   Object.values(await req.body).every((val) => {
  //     return val.length > 1;
  //   })
  // ) {
  //   const { usernameOrEmail, password } = await req.body;
  //   const sanitizedUsername = sanitizeHtml(req.sanitize(username));

  //   await logInValidatorSchema
  //     .validateAsync(
  //       { username: sanitizedUsername, password },
  //       {
  //         escapeHtml: true,
  //         abortEarly: false,
  //       }
  //     )
  //     .then(() => {
  //       res.locals.userCredentials = {
  //         username: sanitizedUsername.toLowerCase(),
  //         password: password,
  //       };
  //       return next();
  //     })
  //     .catch(async (error) => {
  //       const logInValidatorErrors = error.details.map((err) => {
  //         return err.path[0];
  //       });
  //       throw new ErrorHandler(
  //         409,
  //         "There seems to be something wrong with the following fields",
  //         logInValidatorErrors
  //       );
  //     });
  // } else {
  //   throw new ErrorHandler(422, "Unable to procees incomplete data");
  // }
});

// Check the params as well if ever may :params na

// sanitize/validate input
// escape output

/* 
That said, the best defense is to use both context-sensitive escaping at the output, and input validation/sanitization at the input. I consider context-sensitive escaping your most important line of defense. But sanitizing values at the input (based upon your expectation of what valid data should look like) is also a good idea, as a form of defense-in-depth. It can eliminate or mitigate some kinds of programming errors, making it harder or impossible to exploit them.
*/
