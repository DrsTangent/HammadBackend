const { getSlots, isSlotAvailable } = require("../utils/appointments");
const doctorModel = require('../models/doctor.model');
const Appointment = require("../models/appointment.model");
 async function getAvailableSlots(doctorId){
    let doctor = await doctorModel.findById(doctorId);

    let weeklyAvailability = doctor.weeklyAvailability;

    let doctorAppointments = await Appointment.find({doctor: doctorId})

    let slots = getSlots(weeklyAvailability);
    
    let availableSlots = slots.filter((slot)=>isSlotAvailable(slot, doctorAppointments))

    return availableSlots
}

async function bookAppointment(userId, doctorId, slot){
    let doctorAppointments = await Appointment.find({doctor: doctorId})

    let appointment = null;

    if(isSlotAvailable(slot, doctorAppointments)){
        appointment = new Appointment({user: userId, doctor: doctorId, ...slot});
        await appointment.save()
    }

    return appointment
}

module.exports = {getAvailableSlots, bookAppointment}