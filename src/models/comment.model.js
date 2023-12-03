const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Comment = new Schema({
  blog:{
    type: Schema.Types.ObjectId,
    ref: "Blog",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

module.exports = mongoose.model("Comment", Comment)