const mongoose = require('mongoose');
const Review = require('./reviews')
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dlkvrtnax/image/upload/w_300/v1631640724/YelpCamp/utlkreurzasxfxizbdki.jpg

const imageSchema = new Schema ({
        url: String,
        filename: String
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_300');
})

const campgroundSchema = new Schema ({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[ 
        {  
            type: Schema.Types.ObjectId,  ref:'Review'  
        }  
    ]
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)