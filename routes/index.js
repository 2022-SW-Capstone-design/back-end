const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4 : uuidv4 } = require('uuid');
const { verifyToken } = require('./middlewares');

const {
    User,
    Novel,
    Chapter,
    OwnedContent,
    UserComment,
    Illust,
    sequelize,
    Sequelize,
    LikedContent
} = require('../models');
const CreateQuery = require('../testQueries.js');
const Op = Sequelize.Op;

router.get('/test', verifyToken, async(req, res, next) => {
    res.send(`test success. id : ${req.body.userId}`);
})

//소설 요약정보 응답하기
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

// 직접 쓴 소설 가져오기
router.get('/written/novel', verifyToken, async (req, res, next) => {
    // 임시로 유저아이디는 req.body에서 가져옴.
    const userId = req.body.userId;
    console.log('written novel userId : ', userId);
    try {
        const writtenNovels = await Novel.findAll({
            raw: true,
            where: {
                User_id: userId,
            }
        });
        res.json(writtenNovels); 
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// 구매한 소설 가져오기
router.get('/purchased/novel', async (req, res, next) => {
    // 임시로 유저아이디는 req.body에서 가져옴.
    const userId = req.body.userId;
    try {
        //sequelize 방식이 복잡하여 일단 raw query 사용
        const query = `
        select *
        from novel, ownedContent
        where ownedContent.type = "novel"
        and ownedContent.id = novel.id
        and ownedContent.User_id = "${userId}"
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


const insertAt = (str, sub, pos) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`;
// 컨텐츠 구매여부 파악 후 챕터의 내용 리턴
router.get('/content/novel/:novelId/chapter/:chapterId', async (req, res, next) => {
    const { novelId, chapterId } = req.params;
    const { illustSet } = req.query;
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
        const url = path.join(__dirname, '../uploads/chapters',await chapter.fileName);
        let content = fs.readFileSync(url, {encoding:'utf-8'});

        if(illustSet) {
            console.log('illust set :', illustSet);

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
                content = insertAt(content, url, index);
                console.log('illust inserted at index :', index);
            })
        }
    
        return res.json({'chapterContent' : content});

    } catch (err) {
        console.log(err);
    }
});

// 소설 검색 
router.get('/search/novel', async (req, res, next) => {
    const { type, keyword } = req.query;
    console.log('keyword :',keyword);
    if(type == 'title') {
        const novels = await Novel.findAll({
            where:{
                title: {
                    [Op.like]: "%"+keyword+"%"
                }
            },
            raw: true
        });
        // console.log('search novel result:', novels);
        res.json({'novels' : novels});
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
        res.json({'novels' : novels});
    }
    else {
        res.status(403).json({"message" : "검색 타입 지정 안됨."});
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

// 챕터의 일러스트 목록 리턴
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



    console.log('illust set list :', firsts);
    res.json(firsts);


});

module.exports = router;
