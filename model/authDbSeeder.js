const AuthenticationModel = require("./dbModels/authenticationModel");
const { v4: uuidV4 } = require("uuid");
const bcrypt = require("bcryptjs");

const userSeed = [
  {
    _id: uuidV4(),
    username: "jonechavez",
    email: "jonechavez@gmail.com",
    password: "LovePoem666!",
    isEmailVerified: true,
  },
  {
    _id: uuidV4(),
    username: "abigailgo",
    email: "abigailgo@gmail.com",
    password: "OliverGo912!",
    isEmailVerified: false,
  },
  {
    _id: uuidV4(),
    username: "daylindaechavez",
    email: "daylindaechavez@gmail.com",
    password: "AlbertMyLove814!",
    isEmailVerified: true,
  },
  {
    _id: uuidV4(),
    username: "albertlewis",
    email: "albertlewis@gmail.com",
    password: "DaylinBeaut620!",
    isEmailVerified: true,
  },
  {
    _id: uuidV4(),
    username: "markjoseph",
    email: "markjoseph@gmail.com",
    password: "StatesNavy520!",
    isEmailVerified: false,
  },
  {
    _id: uuidV4(),
    username: "vincentpeter",
    email: "vincentpeter@gmail.com",
    password: "JaymeeMahal666!",
    isEmailVerified: true,
  },
  {
    _id: uuidV4(),
    username: "ashleymeg",
    email: "ashleymeg@gmail.com",
    password: "DogsCats620!",
    isEmailVerified: false,
  },
  {
    _id: uuidV4(),
    username: "damienjacob",
    email: "damienjacob@gmail.com",
    password: "MineBlox614!",
    isEmailVerified: false,
  },
  {
    _id: uuidV4(),
    username: "ethanlewis",
    email: "ethanlewis@gmail.com",
    password: "BikerGang220!",
    isEmailVerified: false,
  },
  {
    _id: uuidV4(),
    username: "mingcat",
    email: "mingcat@gmail.com",
    password: "MeowMeow666!",
    isEmailVerified: true,
  },
];

exports.seedUserDatabase = async () => {
  userSeed.forEach(async (user) => {
    try {
      const newUser = await new AuthenticationModel(user);

      await newUser.save();
    } catch (error) {
      console.log(error);
    }
  });
  console.log("Populated auth database");
};

exports.deleteUserDatabase = async () => {
  await AuthenticationModel.deleteMany({}).then(() => {
    console.log("deleted auth database");
  });
};
