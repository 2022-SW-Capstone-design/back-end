const express = require('express');
const router = express.Router();
const { verifyToken } = require('./middlewares');

const { User, Illust, Music, Chapter, OwnedContent } = require('../models');
const chapter = require('../models/chapter');

router.post('', verifyToken, async (req, res, next) => {
    const purchasingSets = req.body.purchasingSets;
    const userId = req.body.userId;

    try {
        let totalPrice = 0;
        for (let i of purchasingSets) {
            totalPrice += i.price;
        }
        const userCoin_ = await User.findOne({
            attributes: ['coin'],
            where: {
                id: userId,
            },
        });
        const userCoin = userCoin_.coin;
        if (userCoin < totalPrice) {
            res.json({
                result: 'failed',
                message: 'not enough coins',
            });
        } else if (userCoin >= totalPrice) {
            for (let i of purchasingSets) {
                if (i.contentType == 'chapter') {
                    const novel = await OwnedContent.findOne({
                        raw: true,
                        where: {
                            User_id: userId,
                            type: 'novel',
                            novelId: i.novelId,
                            own: 0,
                        },
                    });

                    if (!novel) {
                        await OwnedContent.create({
                            User_id: userId,
                            type: 'novel',
                            novelId: i.novelId,
                            own: 0,
                        });
                    }

                    await OwnedContent.create({
                        User_id: userId,
                        type: 'chapter',
                        novelId: i.novelId,
                        chapterId: i.chapterId,
                        contentId: null,
                        own: 0,
                    });

                    const sellerUserId_ = await OwnedContent.findOne({
                        attributes: ['User_id'],
                        where: {
                            type: 'chapter',
                            novelId: i.novelId,
                            chapterId: i.chapterId,
                            own: 1,
                        },
                    });
                    let sellerUserId = sellerUserId_.User_id;

                    const sellerCoin_ = await User.findOne({
                        attributes: ['coin'],
                        where: {
                            id: sellerUserId,
                        },
                    });
                    let sellerCoin = sellerCoin_.coin;

                    await User.update(
                        { coin: sellerCoin + i.price },

                        {
                            where: {
                                id: sellerUserId,
                            },
                        }
                    );
                    ///////////////////////////////////////////
                } else if (i.contentType == 'illust') {
                    await OwnedContent.create({
                        User_id: userId,
                        type: 'illust',
                        novelId: i.novelId,
                        chapterId: i.chapterId,
                        contentId: i.contentId,
                        own: 0,
                    });

                    const sellerUserId_ = await OwnedContent.findOne({
                        attributes: ['User_id'],
                        where: {
                            type: 'illust',
                            novelId: i.novelId,
                            chapterId: i.chapterId,
                            contentId: i.contentId,
                            own: 1,
                        },
                    });
                    let sellerUserId = sellerUserId_.User_id;

                    const sellerCoin_ = await User.findOne({
                        attributes: ['coin'],
                        where: {
                            id: sellerUserId,
                        },
                    });
                    let sellerCoin = sellerCoin_.coin;

                    await User.update(
                        { coin: sellerCoin + i.price },

                        {
                            where: {
                                id: sellerUserId,
                            },
                        }
                    );
                } else if (i.contentType == 'music') {
                    await OwnedContent.create({
                        User_id: userId,
                        type: 'music',
                        novelId: i.novelId,
                        chapterId: i.chapterId,
                        contentId: i.contentId,
                        own: 0,
                    });

                    const sellerUserId_ = await OwnedContent.findOne({
                        attributes: ['User_id'],
                        where: {
                            type: 'music',
                            novelId: i.novelId,
                            chapterId: i.chapterId,
                            contentId: i.contentId,
                            own: 1,
                        },
                    });
                    let sellerUserId = sellerUserId_.User_id;

                    const sellerCoin_ = await User.findOne({
                        attributes: ['coin'],
                        where: {
                            id: sellerUserId,
                        },
                    });
                    let sellerCoin = sellerCoin_.coin;

                    await User.update(
                        { coin: sellerCoin + i.price },

                        {
                            where: {
                                id: sellerUserId,
                            },
                        }
                    );
                } else {
                    continue;
                }
            }

            await User.update(
                {
                    coin: userCoin - totalPrice,
                },
                {
                    where: { id: userId },
                }
            );
            res.json({
                result: 'success',
                message: 'purchase success',
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
