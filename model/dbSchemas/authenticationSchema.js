const mongoose = require("mongoose");
const { Schema } = mongoose;
const {
  emailRegex,
  passwordRegex,
} = require("../../middleware/validators/regexValidators");
const { v4: uuidV4 } = require("uuid");

const deviceCountLimiter = (val) => {
  if (this.userRole === "member" && this.isEmailVerified === true) {
    return val.length <= 6;
  }

  if (this.userRole === "premium" && this.isEmailVerified === true) {
    return val.length <= 10;
  }

  return val.length <= 3;
};

//make sure to set up custom validators here that are in sync with the joi validators. maybe even consider centralizing validators

exports.authenticationSchema = new Schema(
  {
    _id: { type: String, required: true, select: false },
    username: {
      type: String,
      // required: [true, 'username is required'],
      default: Buffer.from(uuidV4().replace(/-/g, ""), "hex").toString(
        "base64"
      ),
      trim: true,
      unique: true,
      max: 32,
      select: false,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
      max: 256,
      match: emailRegex,
      select: false,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      min: 6,
      max: 32,
      match: passwordRegex,
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      select: false,
    },
    emailVerificationPin: {
      type: String,
      default: uuidV4(),
      select: false,
    },
    userInformationReference: {
      type: Schema.Types.ObjectId,
      ref: "users",
      select: false,
    },
    userRole: {
      type: String,
      default: "free",
      select: false,
    },
    errorLogReference: {
      type: Schema.Types.ObjectId,
      ref: "errorLog",
      select: false,
    },
    refreshTokens: {
      type: [
        {
          type: String,
        },
      ],
      select: false,
    },
    resetPins: {
      type: [
        {
          type: String,
        },
      ],
      select: false,
    },
  },
  { timestamps: true, select: false }
);

/*
Think about the format of the auth tokens.
should they have user-agent fields? possibly IP adress for additional security as well.
*/
