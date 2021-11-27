const jwt = require("jsonwebtoken");

exports.resetTokenHandler = async (email, resetPin) => {
  const resetToken = jwt.sign(
    {
      resetToken: await email,
    },
    await resetPin,
    {
      issuer: "Authentication Server",
      subject: "Password Reset",
      audience: "https://www.datetask.com",
      expiresIn: "1800000",
    }
  );

  return resetToken;
};
