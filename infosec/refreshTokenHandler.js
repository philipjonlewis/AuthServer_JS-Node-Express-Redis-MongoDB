const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const privateKey = fs.readFileSync(
  path.resolve(__dirname, "../keys/refreshTokenKeys/refreshTokenPrivate.key"),
  "utf8"
);

const AuthenticationModel = require("../model/dbModels/authenticationModel");

exports.refreshTokenHandler = async (user) => {
  const refreshToken = await jwt.sign(
    {
      refreshToken: await user._id,
    },
    privateKey,
    {
      issuer: await user._id,
      subject: await user.email,
      audience: "https://www.datetask.com",
      expiresIn: "672h",
      algorithm: "RS256",
    }
  );
  await AuthenticationModel.findByIdAndUpdate(await user._id, {
    refreshTokens: [refreshToken],
  });

  return refreshToken;
};
