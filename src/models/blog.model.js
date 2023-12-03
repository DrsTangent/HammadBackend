const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Blog = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageLink: {
    type: String,
    default: null,
    required: true
  },
  author: {
    type: String,
    default: "admin",
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  comments: {
    type: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            required: true
        }
    ],
    required: true,
    default: []
  }
})

module.exports = mongoose.model("Blog", Blog)