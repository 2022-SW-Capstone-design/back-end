
const express = require('express');
const router = express.Router();
const path = require('path');

const { User, Novel } = require('../models'); 

// test page
router.get('/test', async (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../client/myapp/public/index.html'));
});

// 1 - 요약정보 응답하기
router.get('/novel/info/:novelId', async (req, res, next) => {
    const novelId = req.params.novelId;
    console.log(`here, novelID : ${novelId}`);
    try {
        const novelInfo = await Novel.findAll({
            where : {
                novelId : novelId,
            }
        });

        res.send(novelInfo);

    } catch(err) {
        console.log(err);
    }
});


module.exports = router;