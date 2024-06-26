const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  givename: {
    type: String,
  },
  familyName: {
    type: String,
  },
  bio: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  photoUrl: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
  fcmTokens: {
    type: [String],
  },
  following: {
    type: [String],
  },
  interest: {
    type: [String],
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
