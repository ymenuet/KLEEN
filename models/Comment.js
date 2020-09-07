const {
    Schema,
    model
} = require('mongoose')

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: "Place"
    },
    image: String,
    content: String,
    scoreMasks: {
        type: Number,
        min: 0,
        max: 5
    },
    scoreGel: {
        type: Number,
        min: 0,
        max: 5
    },
    scoreClean: {
        type: Number,
        min: 0,
        max: 5
    },
    scoreService: {
        type: Number,
        min: 0,
        max: 5
    }
}, {
    timestamps: true
});

module.exports = model('Comment', commentSchema)