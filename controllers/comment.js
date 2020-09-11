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

    await Place.findByIdAndUpdate(req.params.placeId, {
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

    res.redirect(`/places/${req.params.placeId}`)
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

    const comment = await Comment.findById(commentId)
    let image = comment.image;
    if (req.file) image = req.file.path;

    comment.errorComment = 'Comment not edited: you have to rate all the categories'

    if (scoreMasks === '' || scoreGel === '' || scoreClean === '' || scoreService === '') return res.render('comment/editComment', comment)

    const place = await Place.findById(comment.place)

    const {
        scoreMasks: formerMasks,
        scoreGel: formerGel,
        scoreClean: formerClean,
        scoreService: formerService
    } = comment

    const {
        avgMasks,
        avgGel,
        avgClean,
        avgService,
        contributions
    } = place

    const truncNum = num => parseFloat(num.toFixed(1))

    const newAvgMasks = truncNum((parseFloat(avgMasks) * contributions - parseFloat(formerMasks) + parseFloat(scoreMasks)) / contributions)
    const newAvgGel = truncNum((parseFloat(avgGel) * contributions - parseFloat(formerGel) + parseFloat(scoreGel)) / contributions)
    const newAvgClean = truncNum((parseFloat(avgClean) * contributions - parseFloat(formerClean) + parseFloat(scoreClean)) / contributions)
    const newAvgService = truncNum((parseFloat(avgService) * contributions - parseFloat(formerService) + parseFloat(scoreService)) / contributions)
    const newAverageScore = truncNum((newAvgMasks + newAvgGel + newAvgClean + newAvgService) / 4)

    await Comment.findByIdAndUpdate(commentId, {
        author: req.user._id,
        image,
        content,
        scoreMasks,
        scoreGel,
        scoreClean,
        scoreService,
    })

    await Place.findByIdAndUpdate(comment.place, {
        avgMasks: newAvgMasks,
        avgGel: newAvgGel,
        avgClean: newAvgClean,
        avgService: newAvgService,
        averageScore: newAverageScore
    })

    res.redirect("/profile")
}


exports.deleteComment = async(req, res) => {
    const comment = await Comment.findById(req.params.commentId);
    const placeId = comment.place
    const place = await Place.findById(placeId)

    const {
        scoreMasks,
        scoreGel,
        scoreClean,
        scoreService
    } = comment

    let {
        avgMasks,
        avgGel,
        avgClean,
        avgService,
        contributions
    } = place

    const truncNum = num => parseFloat(num.toFixed(1))

    contributions--

    avgMasks = truncNum((parseFloat(avgMasks) * (contributions + 1) - parseFloat(scoreMasks)) / contributions)
    avgGel = truncNum((parseFloat(avgGel) * (contributions + 1) - parseFloat(scoreGel)) / contributions)
    avgClean = truncNum((parseFloat(avgClean) * (contributions + 1) - parseFloat(scoreClean)) / contributions)
    avgService = truncNum((parseFloat(avgService) * (contributions + 1) - parseFloat(scoreService)) / contributions)
    averageScore = truncNum((avgMasks + avgGel + avgClean + avgService) / 4)

    await Comment.findByIdAndDelete(req.params.commentId);

    await Place.findByIdAndUpdate(placeId, {
        avgMasks,
        avgGel,
        avgClean,
        avgService,
        averageScore,
        contributions
    })

    res.redirect("/profile");
}