const Doctor = require("../models/doctor.model");
const { isDoctorAvailableUsingEmail, getDoctorUsingEmail, getDoctorById, getDoctorsByQuery } = require("../repositories/doctors.repository");
const { generateHash, comparePassword } = require("../utils/passwordGeneration");
const createHttpError = require('http-errors');
const { getToken, getRefreshToken } = require("../utils/authentication");


/*----------------------Assosiated with Doctor Role------------------------*/

/*
Sign Up

Expected Input
(name: String, email: String, password:String)

Expected Output
{
    refreshToken: String,
    token: String,
    doctor:{
        name: String,
        email: String,
        verified: Boolean,
        authStrategy: String
    }
}
*/

async function signup(name, email, password){

    if(await isDoctorAvailableUsingEmail(email)){
        throw new createHttpError.Conflict("Doctor with current email already exists");
    }

    let hashedPassword = generateHash(password);

    let doctor = new Doctor({name, email, password: hashedPassword});

    let payload = {
        id: doctor._id,
        email: doctor.email
    }

    let token = getToken(payload);

    let refreshToken = getRefreshToken(payload);

    doctor.refreshTokens.push({refreshToken});

    await doctor.save();

    return {token, doctor, refreshToken};
}


/*
Sign In

Expected Input
(email: String, password:String)

Expected Output
{
    refreshToken: String,
    token: String,
    doctor:{
        name: String,
        email: String,
        verified: Boolean,
        authStrategy: String
    }
}
*/

async function signin(email, password){
    console.log(email, password);
    let doctor = await getDoctorUsingEmail(email);

    if(!doctor){
        throw new createHttpError.NotFound("Doctor with given email doesn't exist");
    }

    let isMatch = comparePassword(password, doctor.password);

    if(!isMatch){
        throw new createHttpError.Unauthorized("Please provide correct credentials to login");
    }

    let payload = {
        id: doctor._id,
        email: doctor.email
    }

    let token = getToken(payload);

    let refreshToken = getRefreshToken(payload);

    doctor.refreshTokens.push({refreshToken});

    doctor.save();

    return {token, doctor, refreshToken};
}

async function getDoctorProfile(doctorId){
    let doctor = await getDoctorById(doctorId);

    if(!doctor)
    {
        throw new createHttpError.NotFound("Doctor with the given information doesn't exist")
    }

    return doctor;
}


async function refreshToken(doctorId, refreshToken){

    let doctor = await getDoctorById(doctorId);

    if(!doctor)
    {
        throw new createHttpError.NotFound("Doctor with given details doesn't exist");
    }

    let payload = {
        id: doctor._id,
        email: doctor.email
    }

    let token = getToken(payload);

    let newRefreshToken = getRefreshToken(payload);

    let changed = false;

    for(let i = 0; i<doctor.refreshTokens.length; i++){
        if(doctor.refreshTokens[i].refreshToken == refreshToken){
            doctor.refreshTokens[i].refreshToken = newRefreshToken;
            changed = true;
            break;
        }
    }

    if(!changed){
        throw new createHttpError.BadRequest("Refresh Token is not valid");
    }
    
    await doctor.save();

    return {token, doctor, refreshToken: newRefreshToken};
}

async function signout(doctorId, refreshToken){
    let doctor = await getDoctorById(doctorId);

    if(!doctor)
    {
        throw new createHttpError.NotFound("Doctor with given details doesn't exist");
    }

    let refreshTokensLength = doctor.refreshTokens.length;

    doctor.refreshTokens = doctor.refreshTokens.filter((refreshTokenObj)=>refreshTokenObj.refreshToken != refreshToken);

    if(refreshTokensLength <= doctor.refreshTokens.length ){
        throw new createHttpError.NotFound("Provided refresh token doesn't exist");
    }

    await doctor.save();
}


/*----------------------Assosiated with Admin Role------------------------*/

async function addDoctor(name, email, password, doctorPhotoLink){

    if(await isDoctorAvailableUsingEmail(email)){
        throw new createHttpError.Conflict("Doctor with current email already exists");
    }

    let hashedPassword = generateHash(password);

    let doctor = new Doctor({name, email, password: hashedPassword, doctorPhotoLink});


    await doctor.save();

    return doctor;
}


async function deleteDoctor(doctorId){
    let doctor = await Doctor.findByIdAndDelete(doctorId);
    
    if(!doctor)
    {
        throw new createHttpError.NotFound("Doctor with given details doesn't exist");
    }
    //Will be implemented later//
    
    return doctor;
}

async function editDoctor(doctorId, doctorObject){
    let doctor = await getDoctorById(doctorId);

    let objectToPass = {};
    
    if(!doctor)
    {
        throw new createHttpError.NotFound("Doctor with given details doesn't exist");
    }
    //If Email is present in doctor Object//
    if(doctorObject.email){
        if(doctor.authStrategy != "local"){
            throw new createHttpError.BadRequest("Given doctor is not using local authentication, So Email cannot be edited");
        }
        doctor.email = doctorObject.email;
        doctor.verified = false;
    }

    if(doctorObject.name){
        doctor.name = doctorObject.name;
    }

    if(doctorObject.doctorPhotoLink){
        doctor.doctorPhotoLink = doctorObject.doctorPhotoLink;
    }

    await doctor.save();

    return doctor;
}


async function viewDoctors(query, limit, offset){
    let {total, doctors} = await getDoctorsByQuery(query, limit, offset);

    return {total, doctors};
}

async function updateProfile(doctorId, name, email, doctorPhotoLink){
    let doctor = await Doctor.findByIdAndUpdate(doctorId, {name, email, doctorPhotoLink}, {new: true});

    if(!doctor)
    {
        throw new createHttpError.NotFound("Doctor with given details doesn't exist");
    }

    return doctor
}

module.exports = {signup, signin, getDoctorProfile, refreshToken, signout, addDoctor, deleteDoctor, editDoctor, viewDoctors, updateProfile}