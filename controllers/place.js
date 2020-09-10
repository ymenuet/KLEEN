const Place = require('../models/Place')
const {
    default: Axios
} = require('axios')

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

    if (name === '' || category === 'Select a category:' || lng === '' || lat === '') return res.render('place/newPlace', {
        name,
        category,
        otherCategory,
        description,
        lng,
        lat,
        error: "*Please fill in all the required fields",
        errorImage: "Due to the missing fields error, you have to upload your image again if you want to add one"
    })

    let image;
    if (req.file) image = req.file.path;

    const {
        data: {
            features: [
                myPlace
            ]
        }
    } = await Axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.MAPBOX_TOKEN}`)

    const address = myPlace.place_name

    const newPlace = await Place.create({
        name,
        category,
        otherCategory,
        description,
        image,
        address,
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

    if (!name) return res.redirect('/places')

    const regex = name.split(' ').join('|');

    const places = await Place.find({
        $or: [{
                name: {
                    $regex: regex,
                    $options: 'i'
                }
            },
            {
                category: {
                    $regex: regex,
                    $options: 'i'
                }
            },
            {
                otherCategory: {
                    $regex: regex,
                    $options: 'i'
                }
            },
            {
                address: {
                    $regex: regex,
                    $options: 'i'
                }
            }
        ]
    })

    res.render('place/places', {
        places
    })
}

exports.advancedSearchPlaces = async(req, res) => {
    const {
        address,
        category,
        averageScore,
        avgMasks,
        avgGel,
        avgClean,
        avgService
    } = req.query;

    const categoryRegex = category ? category : '[\s\S]*';
    const addressRegex = address ? address.split(' ').join('|') : '[\s\S]*';

    const places = await Place.find({
        category: {
            $regex: categoryRegex,
            $options: 'i'
        },
        address: {
            $regex: addressRegex,
            $options: 'i'
        },
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
    res.render('place/editPlace', {
        place
    })
}

exports.editPlaceProcess = async(req, res) => {
    let {
        name,
        category,
        otherCategory,
        description,
        lng,
        lat
    } = req.body

    const place = await Place.findById(req.params.placeId)

    if (name === '' || lng === '' || lat === '') return res.render('place/editPlace', {
        place,
        error: "*Please fill in all the required fields",
        errorImage: "*Due to the missing fields error, you have to upload your image again if you want to update the current one"
    })

    let image = place.image;
    if (req.file) image = req.file.path;

    if (category !== "Other") otherCategory = null

    const {
        data: {
            features: [
                myPlace
            ]
        }
    } = await Axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.MAPBOX_TOKEN}`)

    const address = myPlace.place_name

    const updatedPlace = await Place.findByIdAndUpdate(req.params.placeId, {
        name,
        category,
        otherCategory,
        description,
        image,
        address,
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