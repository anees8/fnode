const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/AuthController')
const authenticateJWT  = require('../middleware/auth');




router.post('/register',AuthController.register);
router.post('/login',AuthController.login);
router.post('/forgetPassword',AuthController.forgetPassword);
router.post('/resetPassword',AuthController.ResetPassword)
router.post('/updateUserProfile',authenticateJWT,AuthController.usersprofile)



module.exports=router;