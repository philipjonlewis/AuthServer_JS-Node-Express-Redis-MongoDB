const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const { jwtSignOptions } = require("../../infosec/jwtSignOptions");

const { authenticationSchema } = require("../dbSchemas/authenticationSchema");
// Maybe change to uuidv4

const privateKey = fs.readFileSync(
  path.resolve(
    __dirname,
    "../../keys/refreshTokenKeys/refreshTokenPrivate.key"
  ),
  "utf8"
);

const resetPasswordPinPrivate = fs.readFileSync(
  path.resolve(
    __dirname,
    "../../keys/resetPasswordPinKeys/resetPasswordPinPrivate.key"
  ),
  "utf8"
);

authenticationSchema.pre("save", async function (next) {
  try {
    const token = jwt.sign({ token: uuidv4() }, await this._id);

    this.refreshTokens.push(
      jwt.sign(
        { tokenOne: token, tokenTwo: await this._id },
        privateKey,
        await jwtSignOptions(this)
      )
    );

    this.resetPins.push(
      jwt.sign(
        { email: await this.email, value: uuidv4() },
        resetPasswordPinPrivate,
        {
          issuer: "Special Case",
          subject: "Special Case",
          audience: "https://www.datetask.com",
          expiresIn: "672h",
          algorithm: "RS256",
        }
      )
    );

    if (!this.isModified("password")) {
      return next();
    }

    bcrypt.hash(await this.password, process.env.HASH_VALUE, (err, hash) => {
      if (!err) {
        this.password = hash;
      }
    });

    next();
  } catch (error) {
    console.log("error from db mw", error);
  }
});

const Authentication = mongoose.model("authentication", authenticationSchema);
module.exports = Authentication;
