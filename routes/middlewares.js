// 현재 로그인 상태 파악
const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.headers.authorizationtoken) {
            next();
        } else {
            return res.status(403).json({ message: '로그인 필요' });
        }
    },
    isNotLoggedIn: (req, res, next) => {
        if (!req.headers.authorization) {
            next();
        } else {
            return res.status(403).json({ message: '로그아웃 필요' });
        }
    },
    verifyToken: async (req, res, next) => {
        const bearerHeader = req.headers['authorization'];
        if (bearerHeader === undefined) {
            return res.status(403).json({ message: '토큰 정보가 없습니다.' });
        }

        const token = bearerHeader.split(' ')[1];
        await jwt.verify(
            token,
            process.env.JWT_SECRET_KEY,
            async (err, authData) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(403)
                        .json({ message: '토큰 정보가 오염되었습니다.' });
                }
                const userId = authData.userId;

                try {
                    const user = await User.findOne({
                        where: {
                            id: userId,
                        },
                    });

                    if (user) {
                        req.body.userId = user.id;
                    } else {
                        return res.status(403).json({
                            message: '아이디가 존재하지 않습니다.',
                        });
                    }
                } catch (err) {
                    console.error(err);
                    next(err);
                }
            }
        );
        next();
    },
};
