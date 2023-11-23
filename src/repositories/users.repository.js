let User = require('./../models/user.model');
const createHttpError = require('http-errors');


async function getUserUsingEmail(email){
    let user = await User.findOne({email}).catch(error => {
        throw new createHttpError.InternalServerError(error);
    }
    );

    return user
}

async function isUserAvailableUsingEmail(email){
    let user = await getUserUsingEmail(email);

    return (user != null);
}

async function getUserById(userId){
    let user = await User.findById(userId).catch(error => {
        throw new createHttpError.InternalServerError(error);
    }
    );
    
    return user
}


async function getUserRoles(userId){
    let roles = {};

    return roles
}

async function getUsersByQuery(query, limit = process.env.DEFAULT_LIMIT, offset = 0){

    let users = await User.find(query).sort({createdDate: -1}).skip(offset).limit(limit);
    const total = await User.countDocuments(query);

    return {total, users};
}

module.exports = {getUserUsingEmail, getUserById, getUserRoles, isUserAvailableUsingEmail, getUsersByQuery}