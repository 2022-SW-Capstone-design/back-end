const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { v4 : uuidv4 } = require('uuid');
const { verifyToken } = require('./middlewares');

const {
    User,
    Novel,
    Chapter,
    Owned_contents,
    sequelize
} = require('../models');
const CreateQuery = require('../testQueries.js');

// multer middleware
const coverUpload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'uploads/covers');
      },
      filename(req, file, cb) {
        const ext = path.extname(file.originalname); //uuidv4로 변경예정
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, //임시 크기
  });


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
        console.log(__dirname + '/upload');
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
    const chapterID = 6;
    const chapterFileName = `chap-${Novel_novelID}-${chapterID}.txt`;
    const User_userID = "John123"
    const price = req.body.price;
    try {
        await Chapter.create({
            chapterID: chapterID,
            chapterTitle: chapterTitle,
            chapterFileName: chapterFileName,
            Novel_novelID: Novel_novelID,
            chapterPrice: price
        }).then(
            fs.writeFile(`chapters/${chapterFileName}`, chapterContent, { encoding : "utf8", flag: "wx"}, function (error) { // bash 폴더 기준이다
                if (error) return;
                res.write("<script>alert('upload success')</script>");
                res.end();
            })
        ).then(
            await Owned_contents.create({
                novelID: Novel_novelID,
                chapterID: chapterID,
                User_userID: User_userID,
                own: true
            })
        )
    } catch (err) {
        console.log('챕터ID, 또는 소설ID가 잘못되었습니다.');
    }
});

// 소설 업로드
router.post('/upload/novel', verifyToken, coverUpload.single('coverImage'), async (req, res, next) => {
    const { 
        novelTitle, 
        novelDescription, 
        novelGenre, 
        defaultPrice,
    } = req.body;

    jwt.verify(req.token, process.env.JWT_SECRET_KEY, async (err, authData) => {
        if(err) {
            console.log(err);
            next(err);
        }
        const userID = authData.userID;
        const novelID = 12345; // uuidv4로 변경예정

        try {
            await Novel.create({
                novelTitle,
                novelDescription,
                novelGenre,
                novelID,
                userID,
                coverFileName : req.file.filename,
                defaultPrice
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    })
});


module.exports = router;