const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
})

const Admin = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  adminPhotoLink: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [Session],
  },
})

module.exports = mongoose.model("Admin", Admin)