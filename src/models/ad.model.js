const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Ad = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  photosLinks: {
    type: [String],
    required: true
  },
  usersLikes:{
    type:[
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    default: []
  },
  date: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

module.exports = mongoose.model("Ad", Ad)