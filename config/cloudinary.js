const cloudinary = require('cloudinary').v2
const {
    CloudinaryStorage
} = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => ({
        folder: "KLEEN",
        allowed_formats: ['jpg', 'png'],
        public_id: `kleen-${file.originalname}`
    }),
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === 'image/jpg') cb(null, true)
    else {
        req.fileFormatError = 'Allowed file formats are JPG and PNG. Please try again.'
        cb(null, false, new Error('Allowed file formats are JPG and PNG'))
    }
}

module.exports = multer({
    storage,
    fileFilter
})