const doctorModel = require('../models/doctor.model');
const appointmentModel = require('../models/appointment.model');
const { dataResponse, messageResponse } = require('../utils/commonResponse');
const multerFilesParser = require("../utils/multerFilesParser");
const appointmentServices = require('../services/appointments.services')

async function viewUserAppointments(req, res, next){
    try{
        let userId = req.user.id;

        let appointments = await appointmentModel.find({user: userId}).populate('doctor')
        
        return res.status(200).send(dataResponse("success", {appointments}))
    }
    catch(error){
        return next(error);
    }
}

async function bookAppointment(req, res, next){
    try{
        const userId = req.user.id;
        const doctorId = req.params.doctorId;
        let { slot} = req.body;

        let appointment = await appointmentServices.bookAppointment(userId, doctorId, slot);

        if(!appointment) throw new Error(`Appoinment cannot be created, invalid input`);

        return res.status(200).send(dataResponse("success", {appointment}));
    }
    catch(error){
        return next(error);
    }
}

async function availableSlots(req, res, next){
    try{
        const doctorId = req.params.doctorId;

        let slots = await appointmentServices.getAvailableSlots(doctorId);

        return res.status(200).send(dataResponse("success", {slots}));
    }
    catch(error){
        return next(error);
    }
}

async function viewDoctorAppointments(req, res, next){
    try{
        let doctorId = req.doctor.id;

        let appointments = await appointmentModel.find({doctor: doctorId}).populate('user')
        
        return res.status(200).send(dataResponse("success", {appointments}))
    }
    catch(error){
        return next(error);
    }
}

async function deleteDoctorAppointment(req, res, next){
    try{
        let doctorId = req.doctor.id;
        let appointmentId = req.params.appointmentId;

        let appointment = await appointmentModel.findOneAndDelete({doctor: doctorId, _id: appointmentId});
        if(!appointment) throw new Error(`No Appointment with id ${appointmentId} Found For User`);

        return res.send(messageResponse("success", `Appointment with id ${appointmentId} has been deleted`));
    }
    catch(error){
        return next(error);
    }
}

async function editWeeklyAvailability(req, res, next){
    try{
        let doctorId = req.doctor.id;

        let {weeklyAvailability} = req.body;

        weeklyAvailability.forEach((timing)=>{
            const startDate = new Date(`2023-01-01T${timing.startTime}`);
            const endDate = new Date(`2023-01-01T${timing.endTime}`);
            if(startDate>endDate){
                throw new Error("Start time should be less than End Time")
            }
        })
        
        let doctor = await doctorModel.findByIdAndUpdate(doctorId, {weeklyAvailability}, {new: true});

        if (!doctor) throw new Error(`No Doctor Found With Id ${doctorId}`);

        return res.send(dataResponse("success", {doctor}));
    }
    catch(error){
        return next(error);
    }
}
async function cancelUserAppointment(req, res, next){
    try{
        let userId = req.user.id;
        let appointmentId = req.params.appointmentId;

        let appointment = await appointmentModel.findOneAndDelete({user: userId, _id: appointmentId});
        if(!appointment) throw new Error(`No Appointment with id ${appointmentId} Found For User`);

        return res.send(messageResponse("success", `Appointment with id ${appointmentId} has been deleted`));
    }
    catch(error){
        return next(error);
    }
}

// router.get('/appointments', verifyUser, appointmentController.viewUserAppointments)
// router.post('/appointments', verifyUser, appointmentController.bookAppointment)
// router.delete('/appointments/:appointmentId', verifyUser, appointmentController.cancelUserAppointment)
// router.get('/doctors/:doctorId/availability', verifyUser, appointmentController.availableSlots)
// router.get('/appointments', verifyDoctor, appointmentController.viewDoctorAppointments);
// router.delete('/appointments/:appointmentId', verifyDoctor, appointmentController.deleteDoctorAppointment);
// router.put('/weekly_availability', verifyDoctor, appointmentController.editWeeklyAvailability);    

module.exports = {
    viewUserAppointments, bookAppointment, cancelUserAppointment, availableSlots, viewDoctorAppointments, deleteDoctorAppointment,
    editWeeklyAvailability
}