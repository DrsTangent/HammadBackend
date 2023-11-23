const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
})

const Doctor = new Schema({
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
  specialization: {
    type: String,
    required: true
  },
  refreshTokens: {
    type: [Session],
  },
})

module.exports = mongoose.model("Doctor", Doctor)