// Fix error logging format
// Error Model logging should be here

const ErrorHandler = require("./errorHandler");
const ErrorLogModel = require("../../model/dbModels/errorLogModel");

exports.customErrorMiddleware = (error, req, res, next) => {
  // console.log(error);
  //Error logging should be universal here
  const status = error.status || 500;
  const message = error.message || "Something is wrong";

  // payload should only be for logging errors in the database
  // Make a system to separate errors and log to error DB only the important ones

  return res
    .status(status)
    .clearCookie("__Secure-datetask", { path: "/" })
    .clearCookie("__Secure-datetask-access", { path: "/" })
    .json({
      code: status,
      status: false,
      message: message,
      //remove payload on deployment maybe
      ...(error.payload ? { payload: error.payload } : { payload: null }),
    });
};
