const {
    Schema,
    model
} = require("mongoose");

const placeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: String,
        enum: ["Bar", "Bookstore", "Cinema", "Gym", "Hotel", "Nightclub", "Restaurant", "Store", "Theater", "Other"],
        required: true
    },
    description: String,
    otherCategory: String,
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dlyw9xi3k/image/upload/v1599665580/KLEEN/default-image_xtrcyc.jpg'
    },
    location: {
        type: {
            type: String
        },
        coordinates: [Number],
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    averageScore: {
        type: Number,
        min: 0,
        max: 5
    },
    contributions: {
        type: Number,
        default: 0
    },
    avgMasks: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    avgGel: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    avgClean: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    avgService: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
}, {
    timestamps: true
})

placeSchema.index({
    location: '2dsphere'
})

module.exports = model("Place", placeSchema)