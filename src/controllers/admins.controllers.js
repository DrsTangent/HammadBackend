
const cookiesOptions = require('../../config/cookiesConfig');
const adminServices = require('../services/admins.services');
const { dataResponse, messageResponse } = require('../utils/commonResponse');
const multerFilesParser = require("../utils/multerFilesParser");

/*Handlers for Admin Role*/
async function signin(req, res, next){
    try{
        const {email, password} = req.body;
        let signinRes = await adminServices.signin(email, password);
        res.cookie("refreshToken", signinRes.refreshToken, cookiesOptions)

        return res.status(200).send(dataResponse("success", signinRes))
    }
    catch(error){
        return next(error);
    }
}

async function refreshTokenCall(req, res, next){
    try{
        let oldRefreshToken = req.signedCookies.refreshToken;
        let userId = req.admin.id;

        let {token, admin, refreshToken} = await adminServices.refreshToken(userId, oldRefreshToken);

        res.cookie("refreshToken", refreshToken, cookiesOptions);
        
        return res.send(dataResponse("success", {admin, token}));
        
    }
    catch(error){
        return next(error);
    }
}

async function signout(req, res, next){
    try{
        let oldRefreshToken = req.signedCookies.refreshToken;
        let userId = req.admin.id;

        await adminServices.signout(userId, oldRefreshToken);

        res.clearCookie("refreshToken");
        return res.status(200).send(messageResponse("success", "You've been logged out successfully."));
    }
    catch(error){
        return next(error);
    }
}


async function addAdmin(req, res, next){
    try{
        const {email, password, name} = req.body;

        let adminPhotoLink = await multerFilesParser.getSingleFileUrl("adminPhotoLink", req.files)

        let admin = await adminServices.addAdmin(name, email, password, adminPhotoLink);
        return res.status(201).send(dataResponse("success", {admin}))
    }
    catch(error){
        return next(error);
    }
}


module.exports = {
    signin, refreshTokenCall, signout,  addAdmin
}