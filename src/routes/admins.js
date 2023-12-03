var express = require('express');
var router = express.Router();
const adminController = require('../controllers/admins.controllers');
const userController = require('../controllers/users.controllers');
const doctorsController = require('../controllers/doctors.controllers');
const blogController = require('../controllers/blogs.controllers')
const { verifyAdmin, verifyAdminRefreshToken } = require('../middlewares/authentication');
const {profileFilesByAdmin, blogFiles } = require('../middlewares/fileupload');


/* Module 1: User Profiling */
/* -- Admin Profile -- */
router.post('/signin', adminController.signin);
router.get('/signout', verifyAdminRefreshToken, adminController.signout)
router.get('/refreshTokenCall',verifyAdminRefreshToken, adminController.refreshTokenCall);

// /* -- User Management -- */
router.get('/users', verifyAdmin, userController.viewUsers);
router.get('/users/:userId', verifyAdmin, userController.viewSpecificUser);
router.put('/users/:userId', verifyAdmin, profileFilesByAdmin.fields([{name: "userPhoto"}]), userController.editUser)
router.delete('/users/:userId', verifyAdmin, userController.deleteUser)

// /* -- Doctors Management -- */
router.get('/doctors', verifyAdmin, doctorsController.viewDoctors);
router.get('/doctors/:doctorId', verifyAdmin, doctorsController.viewSpecificDoctor);
router.delete('/doctors/:doctorId', verifyAdmin, doctorsController.deleteDoctor);

/* --- Blog Management */
router.post('/blogs', verifyAdmin, blogFiles.fields([{name: "image"}]), blogController.addBlog);
router.get('/blogs', verifyAdmin, blogController.viewBlogs);
router.get('/blogs/:blogId', verifyAdmin, blogController.viewSpecificBlog);
router.delete('/blogs/:blogId', verifyAdmin, blogController.deleteBlog);
router.put('/blogs/:blogId', verifyAdmin, blogFiles.fields([{name: "image"}]), blogController.editBlog);

module.exports = router;