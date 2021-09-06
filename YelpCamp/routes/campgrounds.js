const express = require('express')
const router = express.Router();

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(validateCampground, isLoggedIn, catchAsync(campgrounds.createNew))

router.get('/new', isLoggedIn, campgrounds.getNew)

router.route('/:id')
    .get(catchAsync(campgrounds.showInd))
    .put(validateCampground, isLoggedIn, isAuthor, catchAsync(campgrounds.edit))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.getEdited))


module.exports = router;