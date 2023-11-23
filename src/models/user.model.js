const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
})

const User = new Schema({
  name: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required:true,
    unique: true
  },
  donations: {
    type: Number,
    required: true,
    default: 0
  },
  createdDate:{
    type: Date,
    required: true,
    default: new Date()
  },
  userPhotoLink: {
    type: String,
    default: null
  },
  refreshTokens: {
    type: [Session],
  }
})

//Remove refreshTokens from the response
User.set("toJSON", {
  transform: function (doc, ret, _options) {
    delete ret.refreshTokens
    return ret
  },
})

module.exports = mongoose.model("User", User)