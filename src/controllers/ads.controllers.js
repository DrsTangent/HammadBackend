
/*
router.get('/advertisements', verifyUser, adController.viewAds)
router.get('/advertisements/:adId', verifyUser, adController.viewSpecificAd)
router.post('/advertisement', verifyUser, adController.addAd)
router.put('/advertisements/:adId', verifyUser, adController.editAd)
router.delete('/advertisements/:adId', verifyUser, adController.deleteAd)
router.patch('/advertisement/:id', verifyUser, adController.likeAd)
*/

const adModel = require('../models/ad.model');
const { dataResponse, messageResponse } = require('../utils/commonResponse');
const multerFilesParser = require("../utils/multerFilesParser");

async function addAd(req, res, next){
    try{
        let userId = req.user.id;

        const {title, description, category, price, contactNumber} = req.body;

        let photosLinks = await multerFilesParser.getMultipleFilesUrls("photos", req.files);
        
        let ad = await adModel.create({user: userId, title, description, category, price, contactNumber, photosLinks});
        
        return res.status(201).send(dataResponse("success", {ad}))
    }
    catch(error){
        return next(error);
    }
}

async function deleteAd(req, res, next){
    try{
        const userId = req.user.id;
        const adId = req.params.adId;

        let ad = await adModel.findOneAndDelete({_id: adId, user: userId});
        
        if(!ad) throw new Error(`No Ad found with id ${adId} for this user`);
        return res.status(200).send(messageResponse("success", "Ad has been deleted successfully"));
    }
    catch(error){
        return next(error);
    }
}

async function editAd(req, res, next){
    try{
        const userId = req.user.id;
        const adId = req.params.adId;

        const {title, description, category, price, contactNumber} = req.body;

        let photosLinks = await multerFilesParser.getMultipleFilesUrls("photos", req.files);

        photosLinks = photosLinks == []?undefined: photosLinks;

        let ad = await adModel.findOneAndUpdate({_id: adId, user: userId}, {title, description, category, price, contactNumber, photosLinks}, {new:true})

        if(!ad) throw new Error(`No Ad found with id ${adId} for this user`);

        return res.status(200).send(dataResponse("success", {ad}));
    }
    catch(error){
        return next(error);
    }
}

async function viewAds(req, res, next){
    try{
        
        let ads = await adModel.find({}).populate("user");
        return res.send(dataResponse("success", {ads}));
    }
    catch(error){
        return next(error);
    }
}

async function viewSpecificAd(req, res, next){
    try{
        let adId = req.params.adId;

        let ad = await adModel.findById(adId).populate('user').populate('usersLikes')

        if(!ad) throw new Error(`No Ad found with id ${adId}`);

        return res.send(dataResponse("success", {ad}));
    }
    catch(error){
        return next(error);
    }
}

async function viewMyAds(req, res, next){
    try{
        let userId = req.user.id;

        let ads = await adModel.find({user: userId}).populate("user");

        return res.send(dataResponse("success", {ads}));
    }
    catch(error){
        return next(error);
    }
}
async function likeAd(req, res, next){
    try{
        let userId = req.user.id;
        let adId = req.params.adId;

        let ad = await adModel.findById(adId);
        
        if(!ad) throw new Error(`No Ad found with id ${adId}`);

        if(ad.usersLikes.indexOf(userId) >= 0)
            throw new Error(`User has already liked Ad with id ${adId}`);
        
        ad.usersLikes.push(userId);

        ad.save();
        
        return res.send(dataResponse("success", {ad}));
    }
    catch(error){
        return next(error);
    }
}

async function dislikeAd(req, res, next){
    try{
        let userId = req.user.id;
        let adId = req.params.adId;

        let ad = await adModel.findById(adId);
        
        if(!ad) throw new Error(`No Ad found with id ${adId}`);

        if(ad.usersLikes.indexOf(userId) < 0)
            throw new Error(`User has not liked Ad with id ${adId}`);
        
        ad.usersLikes = ad.usersLikes.filter((user)=>{user != userId});

        ad.save();
        
        return res.send(dataResponse("success", {ad}));
    }
    catch(error){
        return next(error);
    }
}


module.exports = {
    addAd, deleteAd, viewSpecificAd, editAd, viewAds, likeAd, dislikeAd, viewMyAds
}