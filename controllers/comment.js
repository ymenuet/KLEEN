const Comment = require("../models/Comment");
const Place = require("../models/Place");

exports.createCommentProcess = async(req, res) => {
    const {
        content,
        scoreMasks,
        scoreGel,
        scoreClean,
        scoreService
    } = req.body;

    if (scoreMasks === '' || scoreGel === '' || scoreClean === '' || scoreService === '') return res.redirect(`/places/${req.params.placeId}?errorComment=` + 'Comment not published: you have to rate all the categories')

    let image;
    if (req.file) image = req.file.path;

    const truncNum = num => parseFloat(num.toFixed(1))

    const avgScore = truncNum((parseInt(scoreMasks) + parseInt(scoreService) + parseInt(scoreGel) + parseInt(scoreClean)) / 4);

    const newComment = await Comment.create({
        author: req.user._id,
        place: req.params.placeId,
        image,
        content,
        scoreMasks,
        scoreGel,
        scoreClean,
        scoreService,
        avgScore
    })

    const place = await Place.findById(req.params.placeId)

    const contributions = place.contributions + 1

    const newAvgs = [
        truncNum((place.avgMasks * place.contributions * 100 + scoreMasks * 100) / (contributions * 100)),
        truncNum((place.avgGel * place.contributions * 100 + scoreGel * 100) / (contributions * 100)),
        truncNum((place.avgClean * place.contributions * 100 + scoreClean * 100) / (contributions * 100)),
        truncNum((place.avgService * place.contributions * 100 + scoreService * 100) / (contributions * 100))
    ];

    const averageScore = truncNum((newAvgs[0] + newAvgs[1] + newAvgs[2] + newAvgs[3]) / 4)

    const avg = await Place.findByIdAndUpdate(req.params.placeId, {
        $push: {
            comments: newComment._id
        },
        averageScore,
        contributions,
        avgMasks: newAvgs[0],
        avgGel: newAvgs[1],
        avgClean: newAvgs[2],
        avgService: newAvgs[3],
    })

    res.redirect(`/places/${req.params.placeId}`, avg)
}

exports.editCommentView = async(req, res) => {
    const {
        commentId
    } = req.params;
    const comment = await Comment.findById(commentId)
    res.render("comment/editComment", comment)
}

exports.editCommentProcess = async(req, res) => {
    const {
        commentId
    } = req.params;
    const {
        content,
        scoreMasks,
        scoreGel,
        scoreClean,
        scoreService
    } = req.body;
    const {
        path
    } = req.file;

    await Comment.findByIdAndUpdate(commentId, {
        author: req.user,
        place: req.place,
        image: path,
        content,
        scoreMasks,
        scoreGel,
        scoreClean,
        scoreService,
    })

    res.redirect("place/placeDetail")
}

exports.deleteComment = async(req, res) => {
    await Comment.findByIdAndDelete(req.params.commentId);
    res.redirect("/");
}

