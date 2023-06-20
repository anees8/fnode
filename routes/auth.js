const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/AuthController')
const authenticateJWT  = require('../middleware/auth');
const permission = require('../middleware/permission');



router.post('/register',AuthController.register);
router.post('/login',AuthController.login);
router.post('/logout',AuthController.logout);
router.post('/forgetPassword',AuthController.forgetPassword);
router.post('/resetPassword',AuthController.ResetPassword)
router.post('/updateUserProfile',[authenticateJWT,permission('user_update')],AuthController.usersprofile)
router.get('/users',[authenticateJWT,permission('users_read')],AuthController.getusers)
 router.delete('/users/:userId',[authenticateJWT],AuthController.deleteUser)
router.get('/users/:userId',[authenticateJWT],AuthController.getuser)
router.patch('/users/:userId',[authenticateJWT,permission('user_update')],AuthController.updateuser)
router.post('/multiimageUpload',AuthController.multiimageUpload)


module.exports=router;