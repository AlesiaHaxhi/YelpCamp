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
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6128f9b70d411b229810f467',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius, neque dolor, itaque eveniet ipsa eum modi dolorum odio earum magnam nam excepturi harum accusantium asperiores aliquid dolore nesciunt debitis quae.',            
            price,
            images:  [
                {
                  url: 'https://res.cloudinary.com/dlkvrtnax/image/upload/v1631206021/YelpCamp/y3xhmg6rrojf2hcpl4gg.png',
                  filename: 'YelpCamp/y3xhmg6rrojf2hcpl4gg'
                },
                {
                  url: 'https://res.cloudinary.com/dlkvrtnax/image/upload/v1631206028/YelpCamp/nmfygkbpcixisqkgmcov.png',
                  filename: 'YelpCamp/nmfygkbpcixisqkgmcov'
                },
                {
                  url: 'https://res.cloudinary.com/dlkvrtnax/image/upload/v1631206026/YelpCamp/lr9bk05btazz1ms658qd.png',
                  filename: 'YelpCamp/lr9bk05btazz1ms658qd'
                }
              ],
              geometry: { 
                type : "Point", 
                coordinates : [ -73.9866, 40.7306 ] 
              }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})