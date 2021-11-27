const mongoose = require("mongoose");

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

exports.databaseConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/AuthenticationServer",
      mongooseOptions
    );
    console.log("Connected to the database");
  } catch (error) {
    console.log("Unable to Connect to the database", error);
  }
};
