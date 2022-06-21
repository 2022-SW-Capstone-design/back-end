const express = require('express');
const router = express.Router();
/*
router.post('/comment/:commentId', async (req, res, next) => {
    const id = req.params.commentId;
    try {
        const query1 = `UPDATE CriticComment SET likes = likes-1 WHERE id=${id} and
(SELECT LikedContent.like FROM LikedContent WHERE id=${id})="1";`;
        const query1_1 = `UPDATE LikedContent SET LikedContent.like=LikedContent.like-1 WHERE id=${id}; `;

        const query2 = `UPDATE CriticComment SET likes = likes+1 WHERE id=${id} and
(SELECT LikedContent.like FROM LikedContent WHERE id=${id})="0";`;
        const query2_1 = `UPDATE LikedContent SET LikedContent.like=LikedContent.like+1 WHERE id=${id}; `;

        const result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
        });
        res.json({ message: 'like upload success' });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/illust/:illustId', async (req, res, next) => {
    const id = req.params.illustId;
    try {
        const query1 = `UPDATE illust SET likes = likes+1 WHERE
(SELECT LikedContent.like FROM LikedContent WHERE id=${id})="0";`;
        const query2 = `UPDATE illust SET likes = likes-1 WHERE
(SELECT LikedContent.like FROM LikedContent WHERE id=${id})="1";`;
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.end();
});
router.post('/music/:musicId', async (req, res, next) => {
    const id = req.params.musicId;
    try {
        const query1 = `UPDATE music SET likes = likes+1 WHERE
(SELECT LikedContent.like FROM LikedContent WHERE id=${id})="0";`;
        const query2 = `UPDATE music SET likes = likes-1 WHERE
(SELECT LikedContent.like FROM LikedContent WHERE id=${id})="1";`;
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.end();
});
*/

module.exports = router;
