
const cookiesOptions = require('../../config/cookiesConfig');
const userServices = require('../services/users.services');
const { dataResponse, messageResponse } = require('../utils/commonResponse');
const multerFilesParser = require("../utils/multerFilesParser");


/*Handlers for User Role*/

async function signup(req, res, next){
    try{
        const {email, password, name} = req.body;
        let signupRes = await userServices.signup(name, email, password);
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
        let signinRes = await userServices.signin(email, password);
        res.cookie("refreshToken", signinRes.refreshToken, cookiesOptions)
        return res.status(200).send(dataResponse("success", signinRes))
    }
    catch(error){
        return next(error);
    }
}

async function viewMyProfile(req, res, next){
    try{
        let userId = req.user.id;

        let user = await userServices.getUserProfile(userId);

        return res.send(dataResponse("success", {user}));
    }
    catch(error){
        return next(error);
    }
}


async function refreshTokenCall(req, res, next){
    try{
        let oldRefreshToken = req.signedCookies.refreshToken;
        let userId = req.user.id;

        let {token, user, refreshToken} = await userServices.refreshToken(userId, oldRefreshToken);

        res.cookie("refreshToken", refreshToken, cookiesOptions);
        
        return res.send(dataResponse("success", {token, user, refreshToken}));
        
    }
    catch(error){
        return next(error);
    }
}

async function signout(req, res, next){
    try{
        let oldRefreshToken = req.signedCookies.refreshToken;
        let userId = req.user.id;

        await userServices.signout(userId, oldRefreshToken);

        res.clearCookie("refreshToken");
        return res.status(200).send(dataResponse("success", "You've been logged out successfully."));
    }
    catch(error){
        return next(error);
    }
}

async function addUser(req, res, next){
    try{
        const {email, password, name} = req.body;

        let userPhotoLink = await multerFilesParser.getSingleFileUrl("userPhoto", req.files);
        
        let user = await userServices.addUser(name, email, password, userPhotoLink);
        
        return res.status(201).send(dataResponse("success", {user}))
    }
    catch(error){
        return next(error);
    }
}

async function deleteUser(req, res, next){
    try{
        const userId = req.params.userId;
        await userServices.deleteUser(userId);
        return res.status(200).send(messageResponse("success", "User has been deleted successfully"));
    }
    catch(error){
        return next(error);
    }
}

async function editUser(req, res, next){
    try{
        let userId = req.params.userId;

        let {name, email} = req.body;
 
        let userPhotoLink = await multerFilesParser.getSingleFileUrl("userPhoto", req.files)
        
        let user = await userServices.editUser(userId, {name, email, userPhotoLink});

        return res.status(200).send(dataResponse("success", {user}));
    }
    catch(error){
        return next(error);
    }
}

async function viewUsers(req, res, next){
    try{
        
        let {total, users} = await userServices.viewUsers(mongooseQuery, limit, offset);
        return res.send(dataResponse("success", {total, users}));
    }
    catch(error){
        return next(error);
    }
}

async function viewSpecificUser(req, res, next){
    try{
        let userId = req.params.userId;

        let user = await userServices.getUserProfile(userId);

        return res.send(dataResponse("success", {user}));
    }
    catch(error){
        return next(error);
    }
}

async function updateMyProfile(req, res, next){
    try{
        let userId = req.user.id;

        let {name, email} = req.body;
 
        let userPhotoLink = await multerFilesParser.getSingleFileUrl("userPhoto", req.files)
        
        let user = await userServices.updateProfile(userId, name, email, userPhotoLink);

        return res.status(200).send(dataResponse("success", {user}));
    }
    catch(error){
        return next(error);
    }
}

module.exports = {
    signup, signin, viewMyProfile, refreshTokenCall, signout, 
    
    addUser, deleteUser, viewSpecificUser, editUser, viewUsers, updateMyProfile
}