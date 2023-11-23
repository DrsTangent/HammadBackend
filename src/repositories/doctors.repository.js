let Doctor = require('./../models/doctor.model');
const createHttpError = require('http-errors');


async function getDoctorUsingEmail(email){
    let doctor = await Doctor.findOne({email}).catch(error => {
        throw new createHttpError.InternalServerError(error);
    }
    );

    return doctor
}

async function isDoctorAvailableUsingEmail(email){
    let doctor = await getDoctorUsingEmail(email);

    return (doctor != null);
}

async function getDoctorById(doctorId){
    let doctor = await Doctor.findById(doctorId).catch(error => {
        throw new createHttpError.InternalServerError(error);
    }
    );
    
    return doctor
}


async function getDoctorRoles(doctorId){
    let roles = {};

    return roles
}

async function getDoctorsByQuery(query, limit = process.env.DEFAULT_LIMIT, offset = 0){

    let doctors = await Doctor.find(query).sort({createdDate: -1}).skip(offset).limit(limit);
    const total = await Doctor.countDocuments(query);

    return {total, doctors};
}

module.exports = {getDoctorUsingEmail, getDoctorById, getDoctorRoles, isDoctorAvailableUsingEmail, getDoctorsByQuery}