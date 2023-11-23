const User = require("../models/user.model");
const { isUserAvailableUsingEmail, getUserUsingEmail, getUserById, getUsersByQuery } = require("../repositories/users.repository");
const { generateHash, comparePassword } = require("../utils/passwordGeneration");
const createHttpError = require('http-errors');
const { getToken, getRefreshToken } = require("../utils/authentication");


/*----------------------Assosiated with User Role------------------------*/

/*
Sign Up

Expected Input
(name: String, email: String, password:String)

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

async function signup(name, email, password){

    if(await isUserAvailableUsingEmail(email)){
        throw new createHttpError.Conflict("User with current email already exists");
    }

    let hashedPassword = generateHash(password);

    let user = new User({name, email, password: hashedPassword});

    let payload = {
        id: user._id,
        email: user.email
    }

    let token = getToken(payload);

    let refreshToken = getRefreshToken(payload);

    user.refreshTokens.push({refreshToken});

    await user.save();

    return {token, user, refreshToken};
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
    console.log(email, password);
    let user = await getUserUsingEmail(email);

    if(!user){
        throw new createHttpError.NotFound("User with given email doesn't exist");
    }

    let isMatch = comparePassword(password, user.password);

    if(!isMatch){
        throw new createHttpError.Unauthorized("Please provide correct credentials to login");
    }

    let payload = {
        id: user._id,
        email: user.email
    }

    let token = getToken(payload);

    let refreshToken = getRefreshToken(payload);

    user.refreshTokens.push({refreshToken});

    user.save();

    return {token, user, refreshToken};
}

async function getUserProfile(userId){
    let user = await getUserById(userId);

    if(!user)
    {
        throw new createHttpError.NotFound("User with the given information doesn't exist")
    }

    return user;
}


async function refreshToken(userId, refreshToken){

    let user = await getUserById(userId);

    if(!user)
    {
        throw new createHttpError.NotFound("User with given details doesn't exist");
    }

    let payload = {
        id: user._id,
        email: user.email
    }

    let token = getToken(payload);

    let newRefreshToken = getRefreshToken(payload);

    let changed = false;

    for(let i = 0; i<user.refreshTokens.length; i++){
        if(user.refreshTokens[i].refreshToken == refreshToken){
            user.refreshTokens[i].refreshToken = newRefreshToken;
            changed = true;
            break;
        }
    }

    if(!changed){
        throw new createHttpError.BadRequest("Refresh Token is not valid");
    }
    
    await user.save();

    return {token, user, refreshToken: newRefreshToken};
}

async function signout(userId, refreshToken){
    let user = await getUserById(userId);

    if(!user)
    {
        throw new createHttpError.NotFound("User with given details doesn't exist");
    }

    let refreshTokensLength = user.refreshTokens.length;

    user.refreshTokens = user.refreshTokens.filter((refreshTokenObj)=>refreshTokenObj.refreshToken != refreshToken);

    if(refreshTokensLength <= user.refreshTokens.length ){
        throw new createHttpError.NotFound("Provided refresh token doesn't exist");
    }

    await user.save();
}


/*----------------------Assosiated with Admin Role------------------------*/

async function addUser(name, email, password, userPhotoLink){

    if(await isUserAvailableUsingEmail(email)){
        throw new createHttpError.Conflict("User with current email already exists");
    }

    let hashedPassword = generateHash(password);

    let user = new User({name, email, password: hashedPassword, userPhotoLink});


    await user.save();

    return user;
}


async function deleteUser(userId){
    let user = await User.findByIdAndDelete(userId);
    
    if(!user)
    {
        throw new createHttpError.NotFound("User with given details doesn't exist");
    }
    //Will be implemented later//
    
    return user;
}

async function editUser(userId, userObject){
    let user = await getUserById(userId);

    let objectToPass = {};
    
    if(!user)
    {
        throw new createHttpError.NotFound("User with given details doesn't exist");
    }
    //If Email is present in user Object//
    if(userObject.email){
        if(user.authStrategy != "local"){
            throw new createHttpError.BadRequest("Given user is not using local authentication, So Email cannot be edited");
        }
        user.email = userObject.email;
        user.verified = false;
    }

    if(userObject.name){
        user.name = userObject.name;
    }

    if(userObject.userPhotoLink){
        user.userPhotoLink = userObject.userPhotoLink;
    }

    await user.save();

    return user;
}


async function viewUsers(query, limit, offset){
    let {total, users} = await getUsersByQuery(query, limit, offset);

    return {total, users};
}

async function updateProfile(userId, name, email, userPhotoLink){
    let user = await User.findByIdAndUpdate(userId, {name, email, userPhotoLink}, {new: true});

    if(!user)
    {
        throw new createHttpError.NotFound("User with given details doesn't exist");
    }

    return user
}

module.exports = {signup, signin, getUserProfile, refreshToken, signout, addUser, deleteUser, editUser, viewUsers, updateProfile}