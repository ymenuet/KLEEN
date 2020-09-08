const Place = require('../models/Place')

exports.newPlaceView = (req, res) => {
    res.render('place/newPlace')
}

exports.newPlaceProcess = async(req, res) => {

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

}

exports.deletePlace = async(req, res) => {
    await Place.findByIdAndDelete(req.params.placeId)
}