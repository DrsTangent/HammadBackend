var express = require('express');
const userController = require('../controllers/users.controllers');
const blogController = require('../controllers/blogs.controllers');
const adController = require('../controllers/ads.controllers');
const appointmentController = require('../controllers/appointments.controller');
const { verifyUser, verifyUserRefreshToken } = require('../middlewares/authentication');
const { profileFiles, adFiles } = require('../middlewares/fileupload');
var router = express.Router();

/* Module 1: User Profiling */
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.put('/me', verifyUser, profileFiles.fields([{'name': 'userPhoto'}]), userController.updateMyProfile);
router.get('/me', verifyUser, userController.viewMyProfile);
router.get('/signout', verifyUserRefreshToken, userController.signout)
router.get('/refreshTokenCall',verifyUserRefreshToken, userController.refreshTokenCall);

/* Blogs */
router.get('/blogs', blogController.viewBlogs);
router.get('/blogs/:blogId', blogController.viewSpecificBlog);
router.post('/comments/:blogId', verifyUser, blogController.addComment)
router.put('/comments/:commentId', verifyUser, blogController.editComment)
router.delete('/comments/:commentId', verifyUser, blogController.deleteComment)

/* Ad */
router.get('/advertisements', verifyUser, adController.viewAds)
router.get('/advertisements/me', verifyUser, adController.viewMyAds)
router.get('/advertisements/:adId', verifyUser, adController.viewSpecificAd)
router.post('/advertisements', verifyUser, adFiles.fields([{"name": "photos"}]), adController.addAd)
router.put('/advertisements/:adId', verifyUser, adFiles.fields([{"name": "photos"}]), adController.editAd)
router.delete('/advertisements/:adId', verifyUser, adController.deleteAd)
router.patch('/advertisements/:adId/like', verifyUser, adController.likeAd)
router.patch('/advertisements/:adId/dislike', verifyUser, adController.dislikeAd)

/* Appointments */
router.get('/appointments', verifyUser, appointmentController.viewUserAppointments)
router.post('/doctors/:doctorId/book/', verifyUser, appointmentController.bookAppointment)
router.delete('/appointments/:appointmentId', verifyUser, appointmentController.cancelUserAppointment)
router.get('/doctors/:doctorId/availability', verifyUser, appointmentController.availableSlots)

module.exports = router;