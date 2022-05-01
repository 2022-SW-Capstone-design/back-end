const express = require('express');
const router = express.Router();
const { Report } = require('../models');

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


module.exports = router;