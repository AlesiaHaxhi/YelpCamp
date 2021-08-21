const express = require('express');
const app = express();
const path = require('path');

const ejsMate = require('ejs-mate')
const methodOver = require('method-override');

const { campgroundSchema, reviewSchema } = require('./schemas.js')

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const mongoose = require('mongoose');
const Campground = require('./models/campgrounds');
const Review = require('./models/reviews');

const campgrounds = require('./routes/campgrounds')
app.use('/campgrounds', campgrounds)

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected')
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOver('_method'))

const validateReview = (req, res, next) => { 
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review)

    await review.save()
    await campground.save()

    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId)

    res.redirect(`/campgrounds/${id}`)
}))

app.all('*', (req, res, next) => {
    next (new ExpressError('page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err })

})

app.listen(6300, () => {
    console.log('Listening on port 6300');
})