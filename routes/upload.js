const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuid4 = require('uuid4');
const { verifyToken } = require('./middlewares');
const formidable = require('express-formidable');
const mv = require('mv');

const {
	User,
	Novel,
	Illust,
	Chapter,
	OwnedContent,
	sequelize,
	Music,
	Report,
} = require('../models');
const { createCipheriv } = require('crypto');

// multer middleware
const upload = multer({
	dest: 'uploads/'
});

// 챕터 내용 파일 생성 및 챕터 추가
router.post('/chapter', verifyToken, async (req, res, next) => {
	const { title, novelId, price, content } = req.body;
	const userId = req.body.userId;
	// console.log('content :', content);
	let chapterId = 0, current_chapterNumber = 0;

	try {
		const chapterFileName = uuid4();

		const chapter = await Chapter.create({
			Novel_id: novelId,
			title,
			fileName: chapterFileName,
			price
		});
		chapterId = await chapter.id;
    	fs.writeFileSync(
      		`./uploads/chapters/${chapterFileName}`,
      		content,
		// { encoding: 'utf8', flag: 'wx' },
			(err) => {
				console.error(err);
				next(err);
			}
		);

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
router.post('/novel', verifyToken, async (req, res, next) => {
	const { title, description, genre, defaultPrice, coverImage } = req.body;
	const userId = req.body.userId;

	// console.log(`title:${title} description:${description} genre:${genre} \
    //     defaultPrice:${defaultPrice} coverImage:${coverImage}`);
	const temp = JSON.parse(coverImage).src;

	try {
		const nickname = await User.findOne({
			attributes: ['nickname'],
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
router.post('/img', formidable(), async (req, res, next) => {
	try {
		const fileId = uuid4();
		mv(req.files.image.path,
			`./uploads/illusts/${fileId}.png`,
			(err) => {
				if (err) throw err;
		});
		return res.json({
			url: `http://localhost:8081/illust/${fileId}.png`,
		});
	} catch (err) {
		console.error(err);
		next(err);
	}
});


// 챕터에 삽입된 일러스트 위치데이터 db에 저장
router.post('/illust', verifyToken, async (req, res, next) => {
	const { novelId, chapterId, imgURLs, price } = req.body;
	const userId = req.body.userId;
	let current_set_number = 0;

	try {
		const last_set = await Illust.findOne({
			attributes:['set'],
			where: {
				Chapter_Novel_id: novelId,
				Chapter_id: chapterId
			},
			limit: 1,
			order:[['set', 'DESC']],
			raw: true
		});
		// console.log('last set :', last_set);
		current_set_number = last_set ? await last_set.set : 0;

	} catch(err) {
		console.error(err);
		next(err);
	}

	const nickname = await User.findOne({
		attributes: ['nickname'],
		where: {
			id: userId
		},
		raw: true,
	});
	await Promise.all(
		imgURLs.map(async imgURL => {
			try {
				const { url, index } = imgURL;
				// console.log(`illust url : ${url}, index : ${index}`);
				await Illust.create({
					Chapter_id: chapterId,
					Chapter_Novel_id: novelId,
					userId,
					nickname: nickname.nickname,
					price,
					fileName: url,
					index,
					likes: 0,
					set: current_set_number + 1
				});
			} catch (err) {
				console.error(err);
				next(err);
			}
		})
	);
	console.log('illust create success.');
	res.end();
});

//음악 파일 업로드
router.post('/music', upload.single('musicFile'), verifyToken, async (req, res, next) => {
	const { novelId, chapterId, price, title } = req.body;
	const userId = req.body.userId;
	let current_set_number = 0;

	try {
		const fileId = uuid4();
		const extension = req.file.originalname.split('.').pop();

		fs.renameSync(
			path.join(__dirname, `../${req.file.path}`),
			path.join(__dirname, `../uploads/music/${fileId}.${extension}`),
			(err) => {
				if (err) {
					console.error(err);
					throw err;
				}
			}
		);

		const last_set = await Music.findOne({
			attributes:['set'],
			where: {
				Chapter_Novel_id: novelId,
				Chapter_id: chapterId
			},
			limit: 1,
			order:[['set', 'DESC']],
			raw: true
		});
		current_set_number = last_set ? await last_set.set : 0;

		const nickname = await User.findOne({
			attributes: ['nickname'],
			where: {
				id: userId
			},
			raw: true,
		});

		await Music.create({
			Chapter_id: chapterId,
			Chapter_Novel_id: novelId,
			userId,
			nickname: nickname.nickname,
			title,
			price,
			fileName: `http://localhost:8081/music/${fileId}.${extension}`,
			likes: 0,
			set: current_set_number + 1
		});
		console.log('music create success.');
		res.end();
	} catch (err) {
		console.error(err);
		next(err);
	}
});

//사용자가 해당 챕터에 대해 구매한 음악의 목록 응답 (연수 테스트ok)
router.get('/purchased/music/:novelId/:chapterId', async (req, res, next) => {
	const novelId = req.params.novelId;
	const chapterId = req.params.chapterId;
	try {
		const query = `
    		SELECT * from music
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
router.get('/list/music/:novelId/:chapterId', async (req, res, next) => {
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


module.exports = router;
