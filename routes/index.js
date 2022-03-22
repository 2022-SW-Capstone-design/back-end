const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const {
    User,
    Novel,
    Chapter,
    Owned_contents,
    sequelize
} = require('../models');
const CreateQuery = require('../testQueries.js');
const { Console } = require('console');

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
            where: {
                novelID: novelID,
            }
        });

        res.send(novelInfo);

    } catch (err) {
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
            where: {
                User_userID: userId,
            }
        });

        res.send({
            "novels": writtenNovels
        });

    } catch (err) {
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
        select distinct novelTitle, novelDescription, novelGenre, owned_contents.novelID
        from novel, owned_contents
        where owned_contents.novelID = novel.novelID 
        and owned_contents.User_userID = "${userId}"
        and own = 0;
        `;

        const result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        });
        res.send({
            "novels": result
        });

    } catch (err) {
        console.log(err);
    }
});
//---------------------------------------------------------------------------------------------
// 챕터의 content file 리턴
router.get('/content/novel/:novelId/chapter/:chapterId', async (req, res, next) => {
    // 임시로 유저아이디는 req.body에서 가져옴.
    const novelId = req.params.novelId;
    const chapterId = req.params.chapterId;
    console.log(novelId, chapterId);
    try {
        const chapterFileName = await Chapter.findAll({
            attributes: ['chapterFileName'],
            where: {
                chapterID: chapterId,
                Novel_novelID: novelId
            }
        });
        var _chapterFileName = chapterFileName[0].dataValues["chapterFileName"];
        fs.readFile(`./chapters/${_chapterFileName}`, "utf8", (err, contentFile) => {
            try {
                res.send(contentFile);
            } catch (err) {
                console.log(err);
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// 챕터 업로드 페이지 출력
router.get('/upload/chapter1', async (req, res, next) => {
    try {
        //console.log(__dirname + '/upload');
        res.sendFile(__dirname + '/./upload.html');
    } catch (err) {
        console.log(err);
    }
});

// 챕터 내용 파일 생성 및 챕터 추가
router.post('/upload/chapter', async (req, res, next) => {
    const chapterTitle = req.body.title;
    const chapterContent = req.body.content;
    const Novel_novelID = 1234;
    const chapterId = 4;
    const chapterFileName = `chap-${Novel_novelID}-${chapterId}.txt`;
    try {
        await Chapter.create({
            chapterID: chapterId,
            chapterTitle: chapterTitle,
            chapterFileName: chapterFileName,
            Novel_novelID: Novel_novelID,
        }).then(
            fs.writeFile(`chapters/${chapterFileName}`, chapterContent, { encoding : "utf8", flag: "wx"}, function (error) { // bash 폴더 기준이다
                if (error) return;
                res.write("<script>alert('upload success')</script>");
                res.end();
            })
        )
    } catch (err) {
        console.log('챕터ID, 또는 소설ID가 잘못되었습니다.');
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