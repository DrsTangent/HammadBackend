
const cookiesOptions = require('../../config/cookiesConfig');
const doctorModel = require('../models/doctor.model');
const doctorServices = require('../services/doctors.services');
const { dataResponse, messageResponse } = require('../utils/commonResponse');
const multerFilesParser = require("../utils/multerFilesParser");


/*Handlers for Doctor Role*/

async function signup(req, res, next){
    try{
        const {email, password, name, specialization} = req.body;

        let doctorPhotoLink = await multerFilesParser.getSingleFileUrl("doctorPhoto", req.files)

        let signupRes = await doctorServices.signup(name, email, password, specialization, doctorPhotoLink);
        
        res.cookie("refreshToken", signupRes.refreshToken, cookiesOptions)
        return res.status(201).send(dataResponse("success", signupRes))
    }
    catch(error){
        return next(error);
    }
}

async function signin(req, res, next){
    try{
        console.log(req.body);
        const {email, password} = req.body;
        let signinRes = await doctorServices.signin(email, password);
        res.cookie("refreshToken", signinRes.refreshToken, cookiesOptions)
        return res.status(200).send(dataResponse("success", signinRes))
    }
    catch(error){
        return next(error);
    }
}

async function viewMyProfile(req, res, next){
    try{
        let doctorId = req.doctor.id;

        let doctor = await doctorServices.getDoctorProfile(doctorId);

        return res.send(dataResponse("success", {doctor}));
    }
    catch(error){
        return next(error);
    }
}


async function refreshTokenCall(req, res, next){
    try{
        let oldRefreshToken = req.signedCookies.refreshToken;
        let doctorId = req.doctor.id;

        let {token, doctor, refreshToken} = await doctorServices.refreshToken(doctorId, oldRefreshToken);

        res.cookie("refreshToken", refreshToken, cookiesOptions);
        
        return res.send(dataResponse("success", {token, doctor, refreshToken}));
        
    }
    catch(error){
        return next(error);
    }
}

async function signout(req, res, next){
    try{
        let oldRefreshToken = req.signedCookies.refreshToken;
        let doctorId = req.doctor.id;

        await doctorServices.signout(doctorId, oldRefreshToken);

        res.clearCookie("refreshToken");
        return res.status(200).send(dataResponse("success", "You've been logged out successfully."));
    }
    catch(error){
        return next(error);
    }
}

async function addDoctor(req, res, next){
    try{
        const {email, password, name} = req.body;

        let doctorPhotoLink = await multerFilesParser.getSingleFileUrl("doctorPhoto", req.files);
        
        let doctor = await doctorServices.addDoctor(name, email, password, doctorPhotoLink);
        
        return res.status(201).send(dataResponse("success", {doctor}))
    }
    catch(error){
        return next(error);
    }
}

async function deleteDoctor(req, res, next){
    try{
        const doctorId = req.params.doctorId;
        await doctorServices.deleteDoctor(doctorId);
        return res.status(200).send(messageResponse("success", "Doctor has been deleted successfully"));
    }
    catch(error){
        return next(error);
    }
}

async function editDoctor(req, res, next){
    try{
        let doctorId = req.params.doctorId;

        let {name, email} = req.body;
 
        let doctorPhotoLink = await multerFilesParser.getSingleFileUrl("doctorPhoto", req.files)
        
        let doctor = await doctorServices.editDoctor(doctorId, {name, email, doctorPhotoLink});

        return res.status(200).send(dataResponse("success", {doctor}));
    }
    catch(error){
        return next(error);
    }
}

async function viewDoctors(req, res, next){
    try{
        
        let doctors = await doctorModel.find({});
        return res.send(dataResponse("success", {doctors}));
    }
    catch(error){
        return next(error);
    }
}

async function viewSpecificDoctor(req, res, next){
    try{
        let doctorId = req.params.doctorId;

        let doctor = await doctorServices.getDoctorProfile(doctorId);

        return res.send(dataResponse("success", {doctor}));
    }
    catch(error){
        return next(error);
    }
}

async function updateMyProfile(req, res, next){
    try{
        let doctorId = req.doctor.id;

        let {name, email} = req.body;
 
        let doctorPhotoLink = await multerFilesParser.getSingleFileUrl("doctorPhoto", req.files)
        
        let doctor = await doctorServices.updateProfile(doctorId, name, email, doctorPhotoLink);

        return res.status(200).send(dataResponse("success", {doctor}));
    }
    catch(error){
        return next(error);
    }
}

module.exports = {
    signup, signin, viewMyProfile, refreshTokenCall, signout, 
    
    addDoctor, deleteDoctor, viewSpecificDoctor, editDoctor, viewDoctors, updateMyProfile
}