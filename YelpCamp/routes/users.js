const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

router.get('/register', users.getSignup)
router.post('/register', catchAsync(users.signup))

router.get('/login', users.getLogin)
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)
router.get('/logout', users.logout)

module.exports = router;