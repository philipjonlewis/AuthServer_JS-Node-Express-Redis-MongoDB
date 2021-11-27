const mongoose = require("mongoose");
const { Schema } = mongoose;
const {
  emailRegex,
} = require("../../middleware/validators/regexValidators");

exports.maliciousUserSchema = new Schema(
  {
    email: {
      type: String,
      // required: [true, "email is required"],
      trim: true,
      unique: true,
      max: 256,
      match: emailRegex,
      select: false,
    },
    userAgent: { type: String },
  },
  { timestamps: true }
);
