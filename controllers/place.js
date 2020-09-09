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

exports.searchPlaces = async(req, res) => {
    const {
        name
    } = req.query;

    let nameArr = [];
    if (name) nameArr = name.split(' ')
    const places = await Place.find({
        name: RegExp(`/${name}|${nameArr[0]}|${nameArr[1]}|${nameArr[2]}|${nameArr[3]}|${nameArr[4]}/i`)
    })
    res.render('place/places', {
        places
    })
}

exports.advancedSearchPlaces = async(req, res) => {
    const {
        category,
        averageScore,
        avgMasks,
        avgGel,
        avgClean,
        avgService
    } = req.query;
    const places = await Place.find({
        category,
        averageScore: {
            $gte: averageScore
        },
        avgMasks: {
            $gte: avgMasks
        },
        avgGel: {
            $gte: avgGel
        },
        avgClean: {
            $gte: avgClean
        },
        avgService: {
            $gte: avgService
        }
    })

    res.render('place/places', {
        places
    })
}

exports.viewPlace = async(req, res) => {
    const place = await Place.findById(req.params.placeId)
        .populate({
            path: 'comments',
            model: 'Comment',
            options: {
                sort: {
                    createdAt: -1
                }
            },
            populate: {
                path: 'author',
                model: 'User'
            }
        });
    const {
        errorComment
    } = req.query;
    let userCheck = false;
    if (`${place.creator}` === `${req.user._id}`) userCheck = true
    res.render('place/placeDetails', {
        place,
        userCheck,
        errorComment,
    })
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

    const currentPlace = await Place.findById(req.params.placeId)

    let image = currentPlace.image;
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