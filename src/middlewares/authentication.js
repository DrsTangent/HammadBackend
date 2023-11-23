const createHttpError = require('http-errors')
const {getPayload, getRefreshTokenPayload} = require('../utils/authentication.js')

const verifyAdmin = (req,res,next)=>{
  try{
    let payload = getPayload(req);
    
    if(payload){
        req.admin = {id: payload.id};
    }
    else{
      throw new createHttpError.Unauthorized("User is not authentic");
    }
    return next()
  }
  catch(error){
    return next(error);
  }
    
}

const verifyDoctor = (req,res,next)=>{
  try{
    let payload = getPayload(req);
    
    if(payload){
        req.doctor = {id: payload.id};
    }
    else{
      throw new createHttpError.Unauthorized("User is not authentic");
    }
    return next()
  }
  catch(error){
    return next(error);
  }
    
}


const verifyUser = (req,res,next)=>{
  try{
    let payload = getPayload(req);
    
    if(payload){
        req.user = {id: payload.id};
    }
    else{
      throw new createHttpError.Unauthorized("User is not authentic");
    }
    return next()
  }
  catch(error){
    return next(error);
  }
    
}

const verifyUserRefreshToken = (req, res, next)=>{
    try{
      // Check if req.body.user exists, create it if it doesn't
      let payload = getRefreshTokenPayload(req);
      if(payload){
        req.user = {id: payload.id};
      }
      else{
        throw new createHttpError.Unauthorized("User is not authentic");
      }
      return next()
    }
    catch(error){
      return next(error);
    }
}

const verifyAdminRefreshToken = (req, res, next)=>{
  try{
    // Check if req.body.user exists, create it if it doesn't
    let payload = getRefreshTokenPayload(req);
    if(payload){
      req.admin = {id: payload.id};
    }
    else{
      throw new createHttpError.Unauthorized("User is not authentic");
    }
    return next()
  }
  catch(error){
    return next(error);
  }
  
}

const verifyDoctorRefreshToken = (req, res, next)=>{
  try{
    // Check if req.body.user exists, create it if it doesn't
    let payload = getRefreshTokenPayload(req);
    if(payload){
      req.doctor = {id: payload.id};
    }
    else{
      throw new createHttpError.Unauthorized("User is not authentic");
    }
    return next()
  }
  catch(error){
    return next(error);
  }
  
}

module.exports = {verifyUser, verifyAdmin, verifyDoctor, verifyUserRefreshToken, verifyAdminRefreshToken, verifyDoctorRefreshToken}