const express = require('express')
const router = express.Router();

const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage});

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(validateCampground, isLoggedIn, catchAsync(campgrounds.createNew))
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files)
        res.send('i want posters in my shitty room')
    })
router.get('/new', isLoggedIn, campgrounds.getNew)

router.route('/:id')
    .get(catchAsync(campgrounds.showInd))
    .put(validateCampground, isLoggedIn, isAuthor, catchAsync(campgrounds.edit))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.getEdited))


module.exports = router;