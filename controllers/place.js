const Place = require('../models/Place')
const {
    default: Axios
} = require('axios')
const placesPerPage = 12

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

    if (name === '' || category === 'Select a category:' || lng === '' || lat === '' || !req.file) return res.render('place/newPlace', {
        name,
        category,
        otherCategory,
        description,
        lng,
        lat,
        error: "*Please fill in all the required fields",
        errorImage: "Due to the missing fields error, you have to upload your image again"
    })

    let image = req.file.path;

    const {
        data: {
            features: [
                myPlace
            ]
        }
    } = await Axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1IjoieW1lbnVldCIsImEiOiJja2V1OGw5emowMXhzMnpudzJzMW9rM2pjIn0.ClSDpO_UqVo2gsMkUjma2w`)

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
    let {
        pageNumber
    } = req.params
    pageNumber = parseInt(pageNumber)

    if (pageNumber < 1) return res.redirect('/')

    const places = await Place.find()
        .skip((pageNumber - 1) * placesPerPage)
        .limit(placesPerPage)

    if (places.length === 0) return res.redirect(`/places/page/${pageNumber - 1}`)

    const pagination = {}
    pagination.previousPage = pageNumber == 1 ? 1 : pageNumber - 1
    pagination.nextPage = places.length == placesPerPage ? pageNumber + 1 : pageNumber
    pagination.firstPage = pageNumber == 1
    pagination.lastPage = places.length != placesPerPage

    res.render('place/places', {
        places,
        pagination
    })
}

exports.searchPlaces = async(req, res) => {
    const {
        name
    } = req.query;

    let {
        pageNumber
    } = req.params
    pageNumber = parseInt(pageNumber)

    if (pageNumber < 1) return res.redirect('/')

    if (!name) return res.redirect('/places/page/1')

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
        .skip((pageNumber - 1) * placesPerPage)
        .limit(placesPerPage)

    const pagination = {}
    pagination.query = `?name=${name}`

    if (places.length === 0) return res.redirect(`/places/quick-search/page/${pageNumber - 1}${pagination.query}`)

    pagination.previousPage = pageNumber == 1 ? 1 : pageNumber - 1
    pagination.nextPage = places.length == placesPerPage ? pageNumber + 1 : pageNumber
    pagination.firstPage = pageNumber == 1
    pagination.lastPage = places.length != placesPerPage
    pagination.quick = true


    res.render('place/places', {
        places,
        pagination
    })
}

exports.advancedSearchPlaces = async(req, res) => {
    let {
        address,
        category,
        averageScore,
        avgMasks,
        avgGel,
        avgClean,
        avgService
    } = req.query;

    let {
        pageNumber
    } = req.params
    pageNumber = parseInt(pageNumber)

    if (pageNumber < 1) return res.redirect('/')

    const categoryRegex = category ? category : '[\s\S]*';
    const addressRegex = address ? address.split(' ').join('|') : '[\s\S]*';

    if (averageScore > 5 || averageScore < 0 || !averageScore) averageScore = 0
    if (avgMasks > 5 || avgMasks < 0 || !avgMasks) avgMasks = 0
    if (avgGel > 5 || avgGel < 0 || !avgGel) avgGel = 0
    if (avgClean > 5 || avgClean < 0 || !avgClean) avgClean = 0
    if (avgService > 5 || avgService < 0 || !avgService) avgService = 0

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
        .skip((pageNumber - 1) * placesPerPage)
        .limit(placesPerPage)

    const pagination = {}
    pagination.query = `?address=${address?address:''}&category=${category?category:''}&averageScore=${averageScore}&avgMasks=${avgMasks}&avgGel=${avgGel}&avgClean=${avgClean}&avgService=${avgService}`

    if (places.length === 0 && pageNumber != 1) return res.redirect(`/places/search/page/${pageNumber - 1}${pagination.query}`)

    pagination.previousPage = pageNumber == 1 ? 1 : pageNumber - 1
    pagination.nextPage = places.length == placesPerPage ? pageNumber + 1 : pageNumber
    pagination.firstPage = pageNumber == 1
    pagination.lastPage = places.length != placesPerPage

    res.render('place/places', {
        places,
        pagination
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
    } = await Axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1IjoieW1lbnVldCIsImEiOiJja2V1OGw5emowMXhzMnpudzJzMW9rM2pjIn0.ClSDpO_UqVo2gsMkUjma2w`)

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