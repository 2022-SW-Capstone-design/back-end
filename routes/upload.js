
const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('./middlewares');

const {
    User,
    Novel,
    Illust,
    Chapter,
    Owned_contents,
    sequelize
} = require('../models');


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


// 챕터 업로드 페이지 출력
router.get('/chapter1', async (req, res, next) => {
    try {
        console.log(__dirname + '/upload');
        res.sendFile(__dirname + '/./upload.html');
    } catch (err) {
        console.log(err);
    }
});

// 챕터 내용 파일 생성 및 챕터 추가
router.post('/chapter', async (req, res, next) => {
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
router.post('/novel', verifyToken, coverUpload.single('coverImage'), async (req, res, next) => {
    const { 
        title, 
        rating, 
        nickname, 
        description,
        genre,
        novelId,
        defaultPrice
    } = req.body;

    const userId = req.body.userId;
 
    try {
        await Novel.create({
            id : novelId,
            User_id : userId,
            title,
            description,
            genre,
            coverFileName : req.file.filename,
            defaultPrice,
            rating : 0
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// 이미지 저장 후 url 리턴
router.post('/img', async (req, res, next) => {
    try {
      fs.rename(req.files.image.path, '../uploads/illusts/test.png', (err) =>{
          if(err) throw err;
        }
      )
      return res.json({
        url: 'http://localhost:8081/illust/test.png',
      });
    } catch(err) {
      console.error(err);
      next(err);
    }
});

// 챕터에 삽입된 일러스트 위치데이터 db에 저장
router.post('/illust', async (req, res, next) => {
    const { novelId, chapterId, imgURLs, userId, price } = req.body;
    
    
    Promise.all(imgURLs.map(async imgURL => {
        try {
            const { url, index } = imgURL;
            console.log(`url : ${url}, index : ${index}`);
            Illust.create({
                Chapter_id : chapterId,
                Chapter_Novel_id : novelId,
                userId,
                price,
                fileName: url,
                index,
                likes: 0
            });
        } catch(err) {
            console.error(err);
            next(err);
        }
    }));
    res.json({"message" : "illust upload success"});
});

module.exports = router;