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
  doctorPhotoLink: {
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
  weeklyAvailability: {
    type: [{
      day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    }],
    default: [],
  },
  refreshTokens: {
    type: [Session],
  },
})

module.exports = mongoose.model("Doctor", Doctor)