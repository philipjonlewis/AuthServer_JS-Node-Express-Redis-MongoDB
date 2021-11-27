const jwt = require("jsonwebtoken");

exports.accessTokenHandler = async (idValue) => {
  const newAccessToken = jwt.sign({ access: await idValue }, await idValue, {
    issuer: await idValue,
    subject: await idValue,
    audience: "https://www.datetask.com",
    expiresIn: "1800000",
  });
  return newAccessToken;
};
