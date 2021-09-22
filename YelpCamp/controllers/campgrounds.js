const Campground = require('../models/campgrounds');
const { cloudinary } = require('../cloudinary');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken});

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.getNew = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createNew = async (req, res) => {
    const response = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

     const campground = new Campground(req.body.campground);
     campground.geometry = response.body.features[0].geometry;
     campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
     campground.author = req.user._id;
    
     await campground.save(); 
     console.log(campground)
    
     req.flash('success', 'Successfully added a campground')
     res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showInd = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if(!campground) {
        req.flash('error', "Sorry, don't think we have that :(");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}

module.exports.getEdited = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    
    if(!campground) {
        req.flash('error', "Sorry, don't think we have that :(");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})

    const response = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    campground.geometry = response.body.features[0].geometry;
    
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...imgs)
    await campground.save()

    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        console.log(campground)
    }

    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    
    req.flash('success', 'Campground deleted')
    res.redirect('/campgrounds');
}