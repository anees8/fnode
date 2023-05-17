const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/AuthController')
const authenticateJWT  = require('../middleware/auth');
const permission = require('../middleware/permission');



router.post('/register',AuthController.register);
router.post('/login',AuthController.login);
router.post('/logout',AuthController.logout);
router.post('/forgetPassword',permission('user_pw_update'),AuthController.forgetPassword);
router.post('/resetPassword',permission('user_pw_update'),AuthController.ResetPassword)
router.post('/updateUserProfile',[authenticateJWT,permission('user_update')],AuthController.usersprofile)



module.exports=router;