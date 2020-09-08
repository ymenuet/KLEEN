const Place = require('../models/Place')

exports.newPlaceView = (req, res) => {
    res.render('place/newPlace')
}

exports.newPlaceProcess = async(req, res) => {
    const {
        name,
        category,
        otherCategory,
        description,
        lng,
        lat
    } = req.body

    let image;
    if (req.file) image = req.file.path;

    const newPlace = await Place.create({
        name,
        category,
        otherCategory,
        description,
        image,
        location: {
            type: 'Point',
            coordinates: [lng, lat],
        },
        creator: req.user._id
    })

    res.redirect(`/places/${newPlace._id}`)
}

exports.getPlaces = async(req, res) => {
    const places = await Place.find()
    res.render('place/places', {
        places
    })
}

exports.viewPlace = async(req, res) => {
    const place = await Place.findById(req.params.placeId);
    res.render('place/placeDetails', place)
}

exports.editPlaceView = async(req, res) => {
    const place = await Place.findById(req.params.placeId);
    res.render('place/editPlace', place)
}

exports.editPlaceProcess = async(req, res) => {
    const {
        name,
        category,
        otherCategory,
        description,
        lng,
        lat
    } = req.body

    let image;
    if (req.file) image = req.file.path;

    const updatedPlace = await Place.findByIdAndUpdate(req.params.placeId, {
        name,
        category,
        otherCategory,
        description,
        image,
        location: {
            type: 'Point',
            coordinates: [lng, lat],
        }
    })

    res.redirect(`/places/${updatedPlace._id}`)
}

exports.deletePlace = async(req, res) => {
    await Place.findByIdAndDelete(req.params.placeId)
    res.redirect('/')
}