
const express = require('express');
const router = express.Router();
const path = require('path');

const { User, Novel, Chapter, Owned_contents, sequelize} = require('../models'); 

// test page
router.get('/test', async (req, res, next) => {
    const val = req.body;
    console.log(val);
    res.send(val);
});

//소설 요약정보 응답하기
router.get('/info/novel/:novelID', async (req, res, next) => {
    const novelID = req.params.novelID;
    console.log(`here, novelID : ${novelID}`);
    try {
        const novelInfo = await Novel.findOne({
            include: [{
                model: Chapter,
                as: 'chapters'
            }],
            where : {
                novelID : novelID,
            }
        });

        res.send(novelInfo);

    } catch(err) {
        console.log(err);
    }
});

// 직접 쓴 소설 가져오기
router.get('/written/novel', async (req, res, next) => {
    // 임시로 유저아이디는 req.body에서 가져옴.
    const userId = req.body.userId;
    try {
        const writtenNovels = await Novel.findAll({
            attributes: ['novelTitle', 'novelDescription', 'novelGenre', 'novelID'],
            where : {
                User_userID : userId,
            }
        });

        res.send({
            "novels" : writtenNovels
        });
       
    } catch(err) {
        console.log(err);
    }
});

// 구매한 소설 가져오기
router.get('/purchased/novel', async (req, res, next) => {
    // 임시로 유저아이디는 req.body에서 가져옴.
    const userId = req.body.userId;
    try {
        //sequelize 방식이 복잡하여 일단 raw query 사용
        const query = `
        select distinct novelTitle, novelDescription, novelGenre, Owned_contents.novelID
        from Novel, Owned_contents
        where Owned_contents.novelID = Novel.novelID 
        and Owned_contents.User_userID = "${userId}"
        and own = 0;
        `;

        const result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        });
        res.send({
            "novels" : result
        });
       
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;