var express = require('express');
var router = express.Router();
const adminController = require('../controllers/admins.controllers');
const userController = require('../controllers/users.controllers');
const { verifyAdmin, verifyAdminRefreshToken } = require('../middlewares/authentication');
const {profileFilesByAdmin } = require('../middlewares/fileupload');


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


module.exports = router;