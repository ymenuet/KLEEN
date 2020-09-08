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
        enum: ["Restaurant", "Hotel", "Store", "Gym", "Other"]
    },
    description: String,
    otherCategory: String,
    image: String,
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
            max: 5
        },
        numberOfScores: Number
    },
    avgGel: {
        avg: {
            type: Number,
            min: 0,
            max: 5
        },
        numberOfScores: Number
    },
    avgClean: {
        avg: {
            type: Number,
            min: 0,
            max: 5
        },
        numberOfScores: Number
    },
    avgService: {
        avg: {
            type: Number,
            min: 0,
            max: 5
        },
        numberOfScores: Number
    },
}, {
    timestamps: true
})

placeSchema.index({
    location: '2dsphere'
})

module.exports = model("Place", placeSchema)