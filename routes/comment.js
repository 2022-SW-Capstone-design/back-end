const express = require('express');
const router = express.Router();
const { verifyToken } = require('./middlewares');

const { UserComment, CriticComment, User } = require('../models');

router.post('/user', verifyToken, async (req, res, next) => {
    var chapterId = req.body.chapterId;
    var novelId = req.body.novelId;
    var userId = req.body.userId;
    //var userId = 'john123@ajou.ac.kr'; //임시
    var content = req.body.content;
    var rating = req.body.rating;

    try {
        await UserComment.create({
            Chapter_id: chapterId,
            Chapter_Novel_id: novelId,
            userId: userId,
            content: content,
            rating: rating
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.end();
})


router.post('/critic', verifyToken, async (req, res, next) => {

    var novelId = req.body.novelId;
    var rating = req.body.rating;
    var content = req.body.content;
    var userId = req.body.userId;
    //var userId = 'john123@ajou.ac.kr'; //임시

    try {
        var nickname = await User.findOne({
            attributes: ['nickname'],
            where: {
                id: userId
            }
        })

        await CriticComment.create({
            Novel_id: novelId,
            Novel_User_id: userId,
            nickname: nickname.nickname,
            content: content,
            rating: rating,
            likes: 0
        })

    } catch (err) {
        console.error(err);
        next(err);
    }
    res.end();
})

router.get('/user/:novelId/:chapterId',  async (req, res, next) => {
    var page = Number(req.query.page);
    var each = Number(req.query.each);

    if (req.query.sorted == 'old') {
        sorted = 'asc'
    } else if (req.query.sorted == 'new') {
        sorted = 'desc'
    }

    try {
        var comment = await UserComment.findAll({
            where: {
                Chapter_Novel_id: req.params.novelId,
                Chapter_id: req.params.chapterId
            },
            order: [['id', sorted]],
            limit: each,
            offset: each * (page - 1)
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.send(comment);
})

router.get('/critic/:novelId', async (req, res, next) => {
    var page = Number(req.query.page);
    var each = Number(req.query.each);

    if (req.query.sorted == 'old') {
        sorted = 'asc'
    } else if (req.query.sorted == 'new') {
        sorted = 'desc'
    }

    try {
        var comment = await CriticComment.findAll({
            where: {
                Novel_id: req.params.novelId,
            },
            order: [['id', sorted]],
            limit: each,
            offset: each * (page - 1)
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.send(comment);
})
module.exports = router;