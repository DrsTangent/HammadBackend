
const cookiesOptions = require('../../config/cookiesConfig');
const blogModel = require('../models/blog.model');
const commentModel = require('../models/comment.model');
const doctorServices = require('../services/doctors.services');
const { dataResponse, messageResponse } = require('../utils/commonResponse');
const multerFilesParser = require("../utils/multerFilesParser");

async function addBlog(req, res, next){
    try{
        const {title, description} = req.body;
        let imageLink = await multerFilesParser.getSingleFileUrl("image", req.files);
        let blog = await blogModel.create({title, description, imageLink});
        
        return res.status(201).send(dataResponse("success", {blog}))
    }
    catch(error){
        return next(error);
    }
}

async function deleteBlog(req, res, next){
    try{
        const blogId = req.params.blogId;
        let blog = await blogModel.findByIdAndDelete(blogId);
        if(!blog) throw new Error(`No Blog found with id ${blogId}`);
        return res.status(200).send(messageResponse("success", "Blog has been deleted successfully"));
    }
    catch(error){
        return next(error);
    }
}

async function editBlog(req, res, next){
    try{
        console.log('here');
        let blogId = req.params.blogId;

        let {title, description, date} = req.body;
        let imageLink = await multerFilesParser.getSingleFileUrl("image", req.files);
        console.log(title, description, date)
        let blog = await blogModel.findByIdAndUpdate(blogId, {title, description, imageLink, date}, {new:true})

        return res.status(200).send(dataResponse("success", {blog}));
    }
    catch(error){
        return next(error);
    }
}

async function viewBlogs(req, res, next){
    try{
        
        let blogs = await blogModel.find({});
        return res.send(dataResponse("success", {blogs}));
    }
    catch(error){
        return next(error);
    }
}

async function viewSpecificBlog(req, res, next){
    try{
        let blogId = req.params.blogId;

        let blog = await blogModel.findById(blogId).populate(
            {path: 'comments',
            populate:{
                path: 'user',
                select: '_id name userPhotoLink',
            }
        
        })                

        return res.send(dataResponse("success", {blog}));
    }
    catch(error){
        return next(error);
    }
}

async function addComment(req, res, next){
    try{
        let userId = req.user.id;
        let blogId = req.params.blogId;

        let blog = await blogModel.findById(blogId)

        let {comment} = req.body;
 
        let commentObj = await commentModel.create({user: userId, blog: blogId, text: comment});

        blog.comments.push(commentObj._id);

        blog.save();

        return res.status(200).send(dataResponse("success", {blog, comment: commentObj}));
    }
    catch(error){
        return next(error);
    }
}

async function deleteComment(req, res, next){
    try{
        let userId = req.user.id;

        let commentId = req.params.commentId;
        
        let comment = await commentModel.findOneAndDelete({user: userId, _id: commentId});

        if(!comment) throw new Error(`No Comment found with id ${commentId} for given user`);

        
        await blogModel.updateOne({ _id: comment.blog }, {
            $pullAll: {
                comments: [commentId],
            },
        });

        return res.status(200).send(messageResponse("success", "comment has been deleted successfully"));
    }
    catch(error){
        return next(error);
    }
}

async function editComment(req, res, next){
    try{
        let userId = req.user.id;
        let commentId = req.params.commentId;
        let {comment} = req.body;
        
        let commentObj = await commentModel.findOneAndUpdate({user: userId, _id: commentId}, {text: comment}, {new: true});
        
        if(!commentObj) throw new Error(`No Comment found with id ${commentId} for given user`);


        return res.status(200).send(dataResponse("success", {comment: commentObj}));
    }
    catch(error){
        return next(error);
    }
}
module.exports = {
    addBlog, deleteBlog, viewSpecificBlog, editBlog, viewBlogs, 
    addComment, deleteComment, editComment
}