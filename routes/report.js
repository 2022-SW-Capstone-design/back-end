const express = require('express');
const router = express.Router();
const { Report } = require('../models');

//사용자가 등록한 신고를 서버에 업로드(연수 테스트 ok)
router.post('/upload', async (req, res, next) => {
    const { userId, title, commentId, category, content } = req.body;
    try {
        const query = `
        INSERT INTO report ( User_id, category, commentId, content, title, time, solved)
        VALUES (${userId}, ${category},${commentId},${content}, ${title}, NOW(), "0");
        `
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.json({ "message": "report upload success" });
});

//신고 ID에 대한 신고내용 출력(연수 테스트 ok)
router.get('/content/:reportId', async (req, res, next) => {
    const id = req.params.reportId;
    console.log(id);
    try {
        const about_report = await Report.findOne({
            attributes: ['content'],
            where: {
                id: id
            }
        });
        res.json(about_report);

    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/list', async (req, res, next) => {

    if (req.query.page == undefined) {
        var page = 1
    } else {
        var page = Number(req.query.page);
    }

    if (req.query.each == undefined) {
        var each = 10
    } else {
        var each = Number(req.query.each);
    }

    if (req.query.category == 'comment') {
        var category = "댓글";
    } else if (req.query.category == 'novel') {
        var category = "소설";
    } else {
        var category = ["소설", "댓글"];
    }

    if (req.query.sorted == 'old') {
        var sorted = 'asc'
    } else if (req.query.sorted == 'new') {
        var sorted = 'desc'
    } else if (req.query.sorted == undefined) {
        var sorted = 'desc'
    }

    try {
        var comment = await Report.findAll({
            where: { 
                solved: 0,
                category: category
            },
            order: [['id', sorted]],
            limit: each,
            offset: each * (page - 1)
        })
        res.send(comment);
    } catch (err) {
        console.error(err);
        next(err);
    }
})
module.exports = router;
