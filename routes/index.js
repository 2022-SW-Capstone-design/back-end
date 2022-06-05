const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const { verifyToken } = require('./middlewares');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: 'ap-northeast-2'
});

const {
    User,
    Novel,
    Chapter,
    OwnedContent,
    UserComment,
    Illust,
    Music,
    sequelize,
    Sequelize,
    LikedContent
} = require('../models');
const Op = Sequelize.Op;
router.get('/test', (req, res, next) => {
    res.send("test success");
});
//소설 요약정보 응답하기 (연수 테스트 ok)
router.get('/info/novel/:novelId', async (req, res, next) => {
    const novelId = req.params.novelId;

    try {
        const novelInfo = await Novel.findOne({
            include: [{
                model: Chapter,
                as: 'chapters'
            }],
            where: {
                id: novelId,
            }
        });
        // console.log(novelInfo);
        res.send(novelInfo);

    } catch (err) {
        console.log(err);
        next(err);
    }
  });

// 직접 쓴 소설 가져오기(연수 테스트 ok)
router.get('/written/novel', verifyToken, async (req, res, next) => {
    // 임시로 유저아이디는 req.body에서 가져옴.
    const userId = req.body.userId;
    // console.log('written novel userId : ', userId);
    try {
        const writtenNovels = await Novel.findAll({
            raw: true,
            where: {
                User_id: userId,
            }
        });

        writtenNovels.map(novel => {
            novel['isPurchased'] = 1;
        });

        // console.log('written novels :', writtenNovels);
        res.json(writtenNovels);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// 구매한 소설 가져오기
router.get('/purchased/novel', verifyToken, async (req, res, next) => {
    // 임시로 유저아이디는 req.body에서 가져옴.
    const userId = req.body.userId;
    try {
        const query = `
        select *
        from novel, ownedcontent
        where ownedcontent.type = "novel"
        and ownedcontent.novelId = novel.id
        and ownedcontent.User_id = "${userId}"
        and own = 0;
        `;

        const purchasedNovels = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        });
        purchasedNovels.map(novel => {
            novel['isPurchased'] = 1;
        });

        res.json(purchasedNovels);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/purchased/illust', async (req, res, next) => {

});


const insertAt = (str, sub, pos) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`;
// 컨텐츠 구매여부 파악 후 챕터의 내용 리턴
router.get('/content/novel/:novelId/chapter/:chapterId', async (req, res, next) => {
    const { novelId, chapterId } = req.params;
    const { illustSet, musicSet } = req.query;
    // const userId = req.body.userId;
 
    try {
        // const owned = await OwnedContent.findOne({
        //     attributes:['own'],
        //     where:{
        //         User_id: userId,
        //         type: 'chapter',
        //         novelId: novelId,
        //         chapterId: chapterId
        //     }
        // });
        // if(!owned) {
        //     res.status(403).json({"message" : "구매하지 않은 챕터입니다."});
        // }


        const chapter = await Chapter.findOne({
            attributes: ['fileName'],
            where: {
                Novel_id: novelId,
                id: chapterId,
            }
        });
        const chapterFileName = await chapter.fileName;
        const params = {
            Bucket: 'noveland-s3-bucket',
            Key: `${chapterFileName}.md`
        };
        let content = await s3.getObject(params).promise();
        content = content.Body.toString('utf-8');
        // let content = fs.readFileSync(url, {encoding:'utf-8'}).toString();
        let tracks = {};
        if(illustSet) {
            // console.log('illust set :', illustSet);

            // const owned = await OwnedContent.findOne({
            //     attributes:['own'],
            //     where:{
            //         User_id: userId,
            //         type: 'illust',
            //         novelId: novelId,
            //         chapterId: chapterId,
            //         contentId: illustSet
            //     }
            // });
            // if(!owned) {
            //     res.status(403).json({"message" : "구매하지 않은 일러스트 세트 입니다."});
            // }

            const illusts = await Illust.findAll({
                where: {
                    Chapter_Novel_id: novelId,
                    Chapter_id: chapterId,
                    set: illustSet
                },
                raw: true
            });

            illusts.map(illust => {
                const { fileName:url, index } = illust;
                const md_url = '\n![alt text]('+url+')\n';
                
                content = insertAt(content, md_url, index);
                // console.log('illust inserted at index :', index);
            });
        }

        if (musicSet) {
            tracks = await Music.findAll({
                attributes:[['fileName', 'url']],
                where: {
                    Chapter_Novel_id: novelId,
                    Chapter_id: chapterId,
                    set: musicSet
                },
                raw: true
            });
        }
        // content = content.replace('\\n', '<br>');
        // console.log('after content:', content);
        return res.json({
            'chapterContent' : content,
            'musicTracks' : tracks
        });

    } catch (err) {
        console.log(err);
    }
});

// 소설 검색
router.get('/search/novel', async (req, res, next) => {
    const { type, keyword } = req.query;
    // console.log('keyword :',keyword);
    const userId = req.body.userId ? req.body.userId : null;
    const isLoggedIn = userId ? 1 : 0;

    try {
        if(type == 'title') {
            const novels = await Novel.findAll({
                where:{
                    title: {
                        [Op.like]: "%"+keyword+"%"
                    }
                },
                raw: true
            });
            if(isLoggedIn) {
                console.log('should be logged in. userID:', userId);
                await Promise.all(novels.map(async novel => {
                    const isPurchased = await OwnedContent.findOne({
                        where: {
                            User_id: userId,
                            type:'novel',
                            novelId: novel.id,
                        },
                        raw: true
                    });
                    novel['isPurchased'] = isPurchased ? 1 : 0;
                }));
            }
            else {
                novels.map(novel => {
                    novel['isPurchased'] = 0;
                });
            }

            // console.log('search novel result:', novels);
            return res.json({'novels' : novels});
        }
        else if(type == 'author') {
            const novels = await Novel.findAll({
                where:{
                    nickname: {
                        [Op.like]: "%"+keyword+"%"
                    }
                },
                raw: true
            });
            // console.log('search novel result:', novels);
            return res.json({'novels' : novels});
        }
        else {
            return res.status(403).json({"message" : "검색 타입 지정 안됨."});
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.post('/comment/user', verifyToken, async (req, res, next) => {
    const { chapterId, novelId, userId, rating, content } = req.body;
    try {
        await UserComment.create({
            Chapter_id : chapterId,
            Chapter_Novel_id : novelId,
            userId,
            rating,
            content
        });

    } catch(err) {
        console.error(err);
        next(err);
    }
    res.end();
});

router.get('/comment/user/:novelId/:chapterId', async (req, res, next) => {
    const { novelId, chapterId } = req.params;
    try {
        const query = `
        select User.id as commentId, nickname, rating, content
        from User, UserComment
        where User.id = UserComment.userId
        and Chapter_id = ${chapterId}
        and Chapter_Novel_id = ${novelId};
        `
        await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        }).then(result => {
            res.json({'comments' : result});
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 소설의 챕터목록 리턴
router.get('/list/novel/:novelId', verifyToken, async (req, res, next) => {
    const novelId = req.params.novelId;
    const userId = req.body.userId;

    try {
        const chapters = await Chapter.findAll({
            where:{
                Novel_id: novelId
            },
            raw: true
        });

        await Promise.all(chapters.map(async chapter => {
            const isPurchased = await OwnedContent.findOne({
                where: {
                    User_id: userId,
                    type:'chapter',
                    novelId: novelId,
                    chapterId: chapter.id
                }
            });
            chapter['isPurchased'] = isPurchased ? 1 : 0;
        }));
        res.json({"chapters" : chapters});
    } catch(err) {
        console.error(err);
        next(err);
    }
});

// 챕터의 일러스트 세트 목록(각 세트의 첫 일러스트 목록) 리턴
router.get('/list/illust/:novelId/:chapterId', async (req, res, next) => {
    const { novelId, chapterId } = req.params;

    const result = await Illust.findAll({
        attributes:['id'],
        where: {
            Chapter_Novel_id: novelId,
            Chapter_id: chapterId
        },
        raw:true,
        group: ['set']
    });
    const firstIds = result.map(id => id.id);

    const firsts = await Illust.findAll({
        attributes:[['set', 'illustSetId'], ['fileName', 'coverURL'], 'nickname', 'price'],
        where:{
            id: {
                [Op.in]: firstIds
            }
        },
        raw:true
    });
    /// isLiked, isPurchased 추가해야함

    // console.log('illust set list :', firsts);
    res.json(firsts);
});

// 챕터의 음악 세트 목록(각 세트의 첫 음악 목록) 리턴
router.get('/list/music/:novelId/:chapterId', async (req, res, next) => {
    const { novelId, chapterId } = req.params;

    const result = await Music.findAll({
        attributes:['id'],
        where: {
            Chapter_Novel_id: novelId,
            Chapter_id: chapterId
        },
        raw:true,
        group: ['set']
    });
    const firstIds = result.map(id => id.id);

    const firsts = await Music.findAll({
        attributes:[['set', 'musicSetId'], ['fileName', 'musicURL'], 'title', 'nickname', 'price'],
        where:{
            id: {
                [Op.in]: firstIds
            }
        },
        raw:true
    });
    /// isLiked, isPurchased 추가해야함

    // console.log('music set list :', firsts);
    res.json({'musicSets' : firsts});
});



router.get('/info/user',  verifyToken, async (req, res, next) => {
    //const userId = 'john123@ajou.ac.kr';
    try {
        const userInfo = await User.findOne({
            attributes: ['nickname', 'coin', 'admin'],
            where: {id : req.body.userId},
            raw:true
        })
        res.json(userInfo);
    } catch (err) {
        console.error(err);
        next(err);
    }
});


//music stream
// router.get('/music/');

module.exports = router;
