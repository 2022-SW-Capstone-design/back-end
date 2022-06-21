const express = require('express');
const router = express.Router();
const { verifyToken } = require('./middlewares');

const { UserComment, CriticComment, User } = require('../models');

router.post('/user', verifyToken, async (req, res, next) => {
    const { chapterId, novelId, userId, content, rating } = req.body;

    try {
        await UserComment.create({
            Chapter_id: chapterId,
            Chapter_Novel_id: novelId,
            userId: userId,
            content: content,
            rating: rating,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.end();
});

router.post('/critic', verifyToken, async (req, res, next) => {
    const { novelId, rating, content, userId } = req.body;

    try {
        var nickname = await User.findOne({
            attributes: ['nickname'],
            where: {
                id: userId,
            },
        });

        await CriticComment.create({
            Novel_id: novelId,
            Novel_User_id: userId,
            nickname: nickname.nickname,
            content: content,
            rating: rating,
            likes: 0,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.end();
});

router.get('/user/:novelId/:chapterId', async (req, res, next) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const each = req.query.each ? Number(req.query.each) : 10;
    const sorted = req.query.sorted == 'old' ? 'asc' : 'desc';

    try {
        var comment = await UserComment.findAll({
            where: {
                Chapter_Novel_id: req.params.novelId,
                Chapter_id: req.params.chapterId,
            },
            order: [['id', sorted]],
            limit: each,
            offset: each * (page - 1),
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.send(comment);
});

router.get('/critic/:novelId', async (req, res, next) => {
    const page = Number(req.query.page);
    const each = Number(req.query.each);
    const sorted = req.query.sorted == 'old' ? 'asc' : 'desc';

    try {
        var comment = await CriticComment.findAll({
            where: {
                Novel_id: req.params.novelId,
            },
            order: [['id', sorted]],
            limit: each,
            offset: each * (page - 1),
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.send(comment);
});
module.exports = router;
