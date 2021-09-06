const express = require('express')
const router = express.Router();

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');

router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.getNew)
router.post('/', validateCampground, isLoggedIn, catchAsync(campgrounds.createNew))

router.get('/:id', catchAsync(campgrounds.showInd))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.getEdited))
router.put('/:id', validateCampground, isLoggedIn, isAuthor, catchAsync(campgrounds.edit))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.delete))

module.exports = router;