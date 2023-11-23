const Admin = require("../models/admin.model");
const { isAdminAvailableUsingEmail, getAdminUsingEmail, getAdminById } = require("../repositories/admins.repository");
const { generateHash, comparePassword } = require("../utils/passwordGeneration");
const createHttpError = require('http-errors');
const { getToken, getRefreshToken } = require("../utils/authentication");


/*Add Admin*/

async function addAdmin(name, email, password, adminPhotoLink){

    if(await isAdminAvailableUsingEmail(email)){
        throw new createHttpError.Conflict("Admin with current email already exists");
    }

    let hashedPassword = generateHash(password);

    let admin = new Admin({name, email, adminPhotoLink, password: hashedPassword});


    await admin.save();

    return admin;
}


/*
Sign In

Expected Input
(email: String, password:String)

Expected Output
{
    refreshToken: String,
    token: String,
    user:{
        name: String,
        email: String,
        verified: Boolean,
        authStrategy: String
    }
}
*/

async function signin(email, password){
    let admin = await getAdminUsingEmail(email);

    if(!admin){
        throw new createHttpError.NotFound("Admin with given email doesn't exist");
    }

    let isMatch = comparePassword(password, admin.password);

    if(!isMatch){
        throw new createHttpError.Unauthorized("Please provide correct credentials to login");
    }

    let payload = {
        id: admin._id,
        email: admin.email,
        authStrategy: "local"
    }

    let token = getToken(payload);

    let refreshToken = getRefreshToken(payload);

    admin.refreshTokens.push({refreshToken});

    admin.save();

    return {token, admin, refreshToken};
}

async function getUserProfile(userId){
    let user = await getAdminById(userId);

    if(!user)
    {
        throw new createHttpError.NotFound("User with the given information doesn't exist")
    }

    return user;
}


async function refreshToken(userId, refreshToken){

    let admin = await getAdminById(userId);

    if(!admin)
    {
        throw new createHttpError.NotFound("Admin with given details doesn't exist");
    }

    let roles = ["admin"]

    let payload = {
        id: admin._id,
        email: admin.email,
        authStrategy: admin.authStrategy,
        roles
    }

    let token = getToken(payload);

    let newRefreshToken = getRefreshToken(payload);

    let changed = false;

    for(let i = 0; i<admin.refreshTokens.length; i++){
        if(admin.refreshTokens[i].refreshToken == refreshToken){
            admin.refreshTokens[i].refreshToken = newRefreshToken;
            changed = true;
            break;
        }
    }

    if(!changed){
        throw new createHttpError.BadRequest("Refresh Token is not valid");
    }
    
    await admin.save();

    return {token, admin, refreshToken: newRefreshToken};
}

async function signout(userId, refreshToken){
    let admin = await getAdminById(userId);

    if(!admin)
    {
        throw new createHttpError.NotFound("Admin with given details doesn't exist");
    }

    let refreshTokensLength = admin.refreshTokens.length;

    admin.refreshTokens = admin.refreshTokens.filter((refreshTokenObj)=>refreshTokenObj.refreshToken != refreshToken);

    if(refreshTokensLength <= admin.refreshTokens.length ){
        throw new createHttpError.NotFound("Provided refresh token doesn't exist");
    }

    await admin.save();
}


module.exports = {signin, getUserProfile, refreshToken, signout, addAdmin}