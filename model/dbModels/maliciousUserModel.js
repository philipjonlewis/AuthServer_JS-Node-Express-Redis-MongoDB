const mongoose = require("mongoose");
const { maliciousUserSchema } = require("../dbSchemas/maliciousUserSchema");

const MaliciousUser = mongoose.model("malicioususer", maliciousUserSchema);
module.exports = MaliciousUser;
