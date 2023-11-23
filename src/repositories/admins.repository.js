let Admin = require('./../models/admin.model');
const createHttpError = require('http-errors');

async function getAdminUsingEmail(email){
    let admin = await Admin.findOne({email}).catch(error => {
        throw new createHttpError.InternalServerError(error);
    }
    );

    return admin
}

async function isAdminAvailableUsingEmail(email){
    let admin = await getAdminUsingEmail(email);

    return (admin != null);
}

async function getAdminById(id){
    let admin = await Admin.findById(id).catch(error => {
        throw new createHttpError.InternalServerError(error);
    }
    );
    
    return admin
}

module.exports = {getAdminUsingEmail, getAdminById, isAdminAvailableUsingEmail}