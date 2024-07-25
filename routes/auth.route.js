const express = require('express')
const router = express.Router()

const controller = require('../authControllers/auth');

router.post('/signup', controller.handleSignup);
router.post('/google', controller.handleGoogleAuth);
router.get("/previus-chats", controller.previousChats);
router.post('/login', controller.handleLogin);
router.get('/profile/:id', controller.HandleUserProfile);
router.post('/email/:id', controller.handleChangeEmail);
router.post('/email-top/:id', controller.handleChangeEmailOtp);
router.post('/set-password/:id', controller.handleSetGooglePassword);
router.post('/create-password/:id', controller.handleChangePassword);
router.get('/generate-secret/:id', controller.generate2FAsecrete);
router.post('/verify-token/:id', controller.handleVerifyFa);
router.post('/delete-token/:id', controller.handleDeleteAuthentication);
router.post('/request-forget-password', controller.requestForgetPasword);
router.post('/reset-password', controller.resetPassword);


module.exports = router