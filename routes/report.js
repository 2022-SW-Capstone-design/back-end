const express = require('express');
const router = express.Router();
const { Report } = require('../models');

router.post('/upload', async (req, res, next) => {
    const { userId, title, commentId, category, content } = req.body;
    try {
        const query = `
        INSERT INTO report ( User_id, category, commentId, content, title, time, solved)
        VALUES (${userId}, ${category},${commentId},${content}, ${title}, NOW(), "0");
        `;
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.json({ message: 'report upload success' });
});

router.get('/content/:reportId', async (req, res, next) => {
    const id = req.params.reportId;
    console.log(id);
    try {
        const about_report = await Report.findOne({
            attributes: ['content'],
            where: {
                id: id,
            },
        });
        res.json(about_report);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/list', async (req, res, next) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const each = req.query.each ? Number(req.query.each) : 10;
    const sorted = req.query.sorted == 'old' ? 'asc' : 'desc';

    let category = '';
    switch (req.query.category) {
        case 'comment':
            category = '댓글';
            break;
        case 'novel':
            category = '소설';
            break;
        default:
            category = ['소설', '댓글'];
    }

    try {
        var comment = await Report.findAll({
            where: {
                solved: 0,
                category: category,
            },
            order: [['id', sorted]],
            limit: each,
            offset: each * (page - 1),
        });
        res.send(comment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});
module.exports = router;
