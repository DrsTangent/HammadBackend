var express = require('express');
const doctorsController = require('../controllers/doctors.controllers');
const appointmentController = require('../controllers/appointments.controller');
const { verifyDoctorRefreshToken, verifyDoctor } = require('../middlewares/authentication');
const { profileFiles } = require('../middlewares/fileupload');
var router = express.Router();

/* Module 1: User Profiling */
router.post('/signup', profileFiles.fields([{'name': 'doctorPhoto'}]), doctorsController.signup);
router.post('/signin', doctorsController.signin);
router.put('/me', verifyDoctor, profileFiles.fields([{'name': 'doctorPhoto'}]), doctorsController.updateMyProfile);
router.get('/me', verifyDoctor, doctorsController.viewMyProfile);
router.get('/signout', verifyDoctorRefreshToken, doctorsController.signout)
router.get('/refreshTokenCall',verifyDoctorRefreshToken, doctorsController.refreshTokenCall);

/* Appointments */
router.get('/appointments', verifyDoctor, appointmentController.viewDoctorAppointments);
router.delete('/appointments/:appointmentId', verifyDoctor, appointmentController.deleteDoctorAppointment);
router.put('/weekly_availability', verifyDoctor, appointmentController.editWeeklyAvailability);

module.exports = router;