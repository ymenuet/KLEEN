const {
    Schema,
    model
} = require("mongoose");

const placeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Restaurante", "Hotel", "Store", "Gym", "Other"]
    },
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
        type: Number,
        min: 0,
        max: 5
    },
    avgGel: {
        type: Number,
        min: 0,
        max: 5
    },
    avgClean: {
        type: Number,
        min: 0,
        max: 5
    },
    avgService: {
        type: Number,
        min: 0,
        max: 5
    },
}, {
    timestamps: true
})

module.exports = model("Place", placeSchema)