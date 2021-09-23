const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 1000; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6128f9b70d411b229810f467',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius, neque dolor, itaque eveniet ipsa eum modi dolorum odio earum magnam nam excepturi harum accusantium asperiores aliquid dolore nesciunt debitis quae.',            
            price,
            images:  [
              {
                url: 'https://res.cloudinary.com/dlkvrtnax/image/upload/v1632415093/YelpCamp/fcbnsqb7dy3i6rhzmtqe.jpg',
                filename: 'YelpCamp/fcbnsqb7dy3i6rhzmtqe'
              },
              {
                url: 'https://res.cloudinary.com/dlkvrtnax/image/upload/v1632415094/YelpCamp/hej23nk9fimoxedxjnz6.jpg',
                filename: 'YelpCamp/hej23nk9fimoxedxjnz6'
              },
              {
                url: 'https://res.cloudinary.com/dlkvrtnax/image/upload/v1632415094/YelpCamp/itpreiocidgx1ipjeuzu.jpg',
                filename: 'YelpCamp/itpreiocidgx1ipjeuzu'
              },
              {
                url: 'https://res.cloudinary.com/dlkvrtnax/image/upload/v1632415094/YelpCamp/mh8v3gcs1lhbuu4qck2l.jpg',
                filename: 'YelpCamp/mh8v3gcs1lhbuu4qck2l'
              }
              ],
              geometry: { 
                type : "Point", 
                coordinates : [
                  cities[random1000].longitude,
                  cities[random1000].latitude
                ]
              }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})