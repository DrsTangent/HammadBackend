const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: {type: String, required: true},
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;