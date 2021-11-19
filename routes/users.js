const express = require('express');
const passport = require('passport');
const router = express.Router();

const usersController = require('../controllers/users_controller');

router.get('/profile', passport.checkAuthentication, usersController.profile);
router.get('/sign-up', passport.checkLoginState, usersController.signUp);
router.get('/sign-in', passport.checkLoginState, usersController.signIn);
router.post('/create', usersController.create);
router.get('/sign-out', usersController.destroySession);

const authenticateOptions = 
{ 
    successRedirect: '/',
    failureRedirect: '/users/sign-in',
    failureFlash: true,
    successFlash : true
}
router.post('/create-session', passport.authenticate('local', authenticateOptions));


module.exports = router;