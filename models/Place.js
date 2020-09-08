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
        enum: ["Bar", "Cinema", "Gym", "Hotel", "Nightclub", "Restaurant", "Store", "Theater", "Other"]
    },
    description: String,
    otherCategory: String,
    image: {
        type: String,
        default: 'https://sisterhoodofstyle.com/wp-content/uploads/2018/02/no-image-1.jpg'
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
    avgMasks: {
        avg: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        numberOfScores: {
            type: Number,
            default: 0
        }
    },
    avgGel: {
        avg: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        numberOfScores: {
            type: Number,
            default: 0
        }
    },
    avgClean: {
        avg: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        numberOfScores: {
            type: Number,
            default: 0
        }
    },
    avgService: {
        avg: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        numberOfScores: {
            type: Number,
            default: 0
        }
    },
}, {
    timestamps: true
})

placeSchema.index({
    location: '2dsphere'
})

module.exports = model("Place", placeSchema)