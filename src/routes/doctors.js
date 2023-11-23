var express = require('express');
const userController = require('../controllers/users.controllers');
const { verifyUser, verifyUserRefreshToken } = require('../middlewares/authentication');
const { profileFiles } = require('../middlewares/fileupload');
var router = express.Router();

/* Module 1: User Profiling */
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.put('/me', verifyUser, profileFiles.fields([{'name': 'userPhoto'}]), userController.updateMyProfile);
router.get('/me', verifyUser, userController.viewMyProfile);
router.get('/signout', verifyUserRefreshToken, userController.signout)
router.get('/refreshTokenCall',verifyUserRefreshToken, userController.refreshTokenCall);

module.exports = router;