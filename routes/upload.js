const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uuid4 = require("uuid4");
const { verifyToken } = require("./middlewares");

const {
	User,
	Novel,
	Illust,
	Chapter,
	OwnedContent,
	sequelize,
	Report,
} = require("../models");

// multer middleware
// const coverUpload = multer({
//     storage: multer.diskStorage({
//       destination(req, file, cb) {
//         cb(null, 'uploads/covers/');
//       },
//       filename(req, file, cb) {
//         const ext = path.extname(file.originalname); //uuidv4로 변경예정
//         cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
//       },
//     }),
//     limits: { fileSize: 5 * 1024 * 1024 }, //임시 크기
//   });

// 챕터 내용 파일 생성 및 챕터 추가
router.post("/chapter", verifyToken, async (req, res, next) => {
	const { title, novelId, price, content } = req.body;
	const userId = req.body.userId;
	//const userId = 'john123@ajou.ac.kr';
	let chapterId = 0, current_chapterNumber = 0;
	console.log('server upload chapter novelId :', novelId);

	try {
		const chapterFileName = uuid4();
		const chapter = await Chapter.create({
			Novel_id: novelId,
			title,
			fileName: chapterFileName,
			price
		});

    await OwnedContent.create({
      User_id: userId,
      type: 'chapter',
      novelId,
      chapterId,
      contentId:null,
      own: true
    });
    
	const temp = await Novel.findOne({
		attributes:['chapterNumber'],
		where: {
		  id: novelId
		},
		raw: true
	  });
	  current_chapterNumber = await temp.chapterNumber;

		await OwnedContent.create({
			User_id: userId,
			type: 'chapter',
			novelId,
			chapterId,
			contentId: null,
			own: true
		});

		current_chapterNumber = await Novel.findOne({
			attributes: ['chapterNumber'],
			where: {
				id: novelId
			}
		}).chapterNumber;

		await Novel.update({
			chapterNumber: current_chapterNumber + 1
		}, {
			where: {
				id: novelId
			}
		});
	} catch (err) {
		console.error(err);
		next(err);
	}
	res.end();
});

// 소설 업로드
router.post("/novel", verifyToken, async (req, res, next) => {
	const { title, description, genre, defaultPrice, coverImage } = req.body;
	const userId = req.body.userId;

	console.log(`title:${title} description:${description} genre:${genre} \
        defaultPrice:${defaultPrice} coverImage:${coverImage}`);
	const temp = JSON.parse(coverImage).src;
	console.log("temp:", temp);
	try {
		const nickname = await User.findOne({
			attributes: ["nickname"],
			where: {
				id: userId
			},
			raw: true,
		});

		await Novel.create({
			User_id: userId,
			nickname: nickname.nickname,
			title,
			description,
			genre,
			coverFileName: temp,
			defaultPrice,
			rating: 0,
			chapterNumber: 0
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
});

// 이미지 저장 후 url 리턴
router.post("/img", async (req, res, next) => {
	try {
		const fileId = uuid4();
		fs.rename(
			req.files.image.path,
			`../uploads/illusts/${fileId}.png`,
			(err) => {
				if (err) throw err;
			}
		);
		return res.json({
			url: `http://localhost:8081/illust/${fileId}.png`,
		});
	} catch (err) {
		console.error(err);
		next(err);
	}
});

// 챕터에 삽입된 일러스트 위치데이터 db에 저장
router.post("/illust", async (req, res, next) => {
	const { novelId, chapterId, imgURLs, userId, price } = req.body;

	Promise.all(
		imgURLs.map(async (imgURL) => {
			try {
				const { url, index } = imgURL;
				console.log(`url : ${url}, index : ${index}`);
				Illust.create({
					Chapter_id: chapterId,
					Chapter_Novel_id: novelId,
					userId,
					price,
					fileName: url,
					index,
					likes: 0,
				});
			} catch (err) {
				console.error(err);
				next(err);
			}
		})
	);
	res.json({ message: "illust upload success" });
});

//사용자가 해당 챕터에 대해 구매한 음악의 목록 응답 (연수 테스트ok)
router.get("/purchased/music/:novelId/:chapterId", async (req, res, next) => {
	const novelId = req.params.novelId;
	const chapterId = req.params.chapterId;
	try {
		const query = `
    SELECT filename from music
      WHERE (Chapter_Novel_id=${novelId} and Chapter_id=${chapterId}) in(
  	     SELECT filename from Ownedcontent
     	   where (chapterId=${chapterId} and novelId=${novelId} ));`;
		const result = await sequelize.query(query, {
			type: sequelize.QueryTypes.SELECT,
		});
		res.send({
			musics: result,
		});
	} catch (err) {
		console.error(err);
	}
});

//해당 챕터에 대한 음악 중 사용자가 구매하지 않은 목록을 리턴(연수  테스트 ok)
router.get("/list/music/:novelId/:chapterId", async (req, res, next) => {
	const novelId = req.params.novelId;
	const chapterId = req.params.chapterId;

	try {
		const query = `
  SELECT filename from music
    WHERE (Chapter_Novel_id=${novelId} and Chapter_id=${chapterId}) not in(
	     SELECT filename from Ownedcontent
   	   where (chapterId=${chapterId} and novelId=${novelId} ));`;
		const result = await sequelize.query(query, {
			type: sequelize.QueryTypes.SELECT,
		});
		res.send({
			musics: result,
		});
	} catch (err) {
		console.error(err);
	}
});

//사용자가 챕터에 대한 음악을 업로드하면 저장소에 음악파일을 저장(연수 테스트 ok)
router.post("/music", async (req, res, next) => {
	const { novelId, chapterId, music, userId, price } = req.body;

	//  Promise.all(music.map(async music1=> {
	try {
		const { musicFile } = music1;
		console.log(`musicFile:${musicFile}`);
		await music.create({
			Chapter_id: chapterId, //&
			Chapter_Novel_id: novelId, //&
			userId,
			price,
			fileName: musicFile,
			likes: 0,
		});
	} catch (err) {
		console.error(err);
		next(err);
	}
	//  }));
	res.json({ message: "music upload success" });
});

// 리포트 쪽으로 옮겨주어야하는 코드들

//사용자가 등록한 신고를 서버에 업로드(연수 테스트 ok)
router.post("/upload", async (req, res, next) => {
	const { userId, title, commentId, category, content } = req.body;
	try {
		const query = `
	INSERT INTO report ( User_id,category, commentId,content,title,time,solved)
  VALUES (${userId}, ${category},${commentId},${content}
   ${title},NOW(),"0");`;
	} catch (err) {
		console.error(err);
		next(err);
	}
	res.json({ message: "report upload success" });
});

//신고 ID에 대한 신고내용 출력(연수 테스트 ok)
router.get("/report/content/:reportId", async (req, res, next) => {
	const id = req.params.reportId;
	console.log(id);
	try {
		const about_report = await report.findOne({
			attributes: ["content"],
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

module.exports = router;
