const express = require('express');
const router = express.Router();
const { verifyToken } = require('./middlewares');

const { User, Illust, Music, Chapter, OwnedContent } = require('../models');
const chapter = require('../models/chapter');

//router.post('', verifyToken, async (req, res, next) => {
router.post('', async (req, res, next) => {
	const purchasingSets = req.body.purchasingSets;
	const userId = "john123@ajou.ac.kr"
	//const userId = req.body.userId;

	try {
		var totalPrice = 0;
		for (var i of purchasingSets) {
			totalPrice += i.price;
		}
		const userCoin_ = await User.findOne({
			attributes: ['coin'],
			where: {
				id: userId
			}
		})
		const userCoin = userCoin_.coin;
		if (userCoin < totalPrice) {
			res.json({
				"result": "failed",
				"message": "not enough coins"
			})
		}
		else if (userCoin >= totalPrice) {

			for (var i of purchasingSets) {
				console.log(i);
				if (i.contentType == "chapter") {
					await OwnedContent.create({
						User_id: userId,
						type: "chapter",
						novelId: i.novelId,
						chapterId: i.chapterId,
						contentId: null,
						own: 0
					})

					/* 판매한 컨텐츠의 코인을 판매자의 코인에 추가하는 코드. 아직 미구현
					const sellerUserId_ = await OwnedContent.findOne({
						attributes: ['User_id'],
						where: {
							type: "chapter",
							novelId: i.novelId,
							chapterId: i.Chapter,
							own: 1,
						}
					})
					var sellerUserId = sellerUserId_.User_id;

					const sellerCoin_ = await User.findOne({
						attributes: ['coin'],
						where: {
							id: sellerUserId
						}
					})
					var sellerCoin = sellerCoin_.coin;

					await User.update(
						{ coin: sellerCoin + i.price },

						{
							where: {
								id: sellerUserId
							}
						}
					)
					*/
				}
				else if (i.contentType == "illust") {
					await OwnedContent.create({
						User_id: userId,
						type: "illust",
						novelId: i.novelId,
						chapterId: i.chapterId,
						contentId: i.contentId,
						own: 0
					})

				}
				else if (i.contentType == "music") {
					await OwnedContent.create({
						User_id: userId,
						type: "music",
						novelId: i.novelId,
						chapterId: i.chapterId,
						contentId: i.contentId,
						own: 0
					})
				}
				else {
					continue;
				}
			}

			await User.update(
				{
					coin: userCoin - totalPrice
				},
				{
					where: { id: userId }
				}
			)
			res.json({
				"result": "success",
				"message": "purchase success"
			})
		}
	} catch (err) {
		console.error(err);
		next(err);
	}
});

module.exports = router;