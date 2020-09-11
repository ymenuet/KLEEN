const express = require('express');
const router = express.Router();
const {
    newPlaceView,
    newPlaceProcess,
    getPlaces,
    searchPlaces,
    advancedSearchPlaces,
    viewPlace,
    editPlaceView,
    editPlaceProcess,
    deletePlace
} = require('../controllers/place')
const {
    catchErrors,
    ensureLogin,
    checkAuthorPlace
} = require('../middlewares')
const upload = require('../config/cloudinary');

// New place
router.get('/new', ensureLogin, newPlaceView);
router.post('/new', ensureLogin, upload.single('image'), catchErrors(newPlaceProcess))

// View places
router.get('/page/:pageNumber', ensureLogin, catchErrors(getPlaces))
router.get('/quick-search/page/:pageNumber', ensureLogin, catchErrors(searchPlaces))
router.get('/search/page/:pageNumber', ensureLogin, catchErrors(advancedSearchPlaces))
router.get('/:placeId', ensureLogin, catchErrors(viewPlace))

// Edit places
router.get('/edit/:placeId', ensureLogin, checkAuthorPlace, catchErrors(editPlaceView))
router.post('/edit/:placeId', ensureLogin, checkAuthorPlace, upload.single('image'), catchErrors(editPlaceProcess))

// Delete places
router.get('/delete/:placeId', ensureLogin, checkAuthorPlace, catchErrors(deletePlace))

module.exports = router