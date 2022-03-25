
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

//회원가입
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { userID, nickname, password } = req.body;
    try {
        const user = await User.findOne({
            where: {
                userID : userID
            }
        });
        if(user) {
            return res.json({ "result" : "failed" });
        }
        const hashed = await bcrypt.hash(password, 12); //salt roud 12번
        
        await User.create({
            userID : userID,
            password : hashed,
            nickname : nickname,
            coin : 0,
        }).then(console.log(`${userID} created.`));
        return res.json({ "result" : "success" });
    } catch(err) {
        console.log(err);
        return next(err);
    }
});

// 로그인
router.post('/login', isNotLoggedIn, async (req, res, next) => {
    try {
        passport.authenticate('local', (authError, user, info) => {
            if(authError) {
                console.log(authError);
                return next(authError);
            }
            if(!user) {
                return res.json({ "result" : info.reason });
            }
            return req.login(user, { session : false }, (loginError) => {
                if(loginError) {
                    console.log(loginError);
                    return next(loginError);
                }

                const token = jwt.sign({
                    userID: user.userID,
                    nickname: user.nickname,
                    // auth: user.auth
                }, 
                process.env.JWT_SECRET_KEY, 
                {
                    expiresIn: '120s'
                });
                return res.json({ token : token });
            });
        })(req, res, next);
    } catch(err) {
        console.log(err);
        next(err);
    }
});

// bearer token 인증
router.post('/jwt', passport.authenticate('jwt', { session: false }), 
    async (req, res, next) => {
        try {
            res.json({"result" : "true"});
        } catch(err) {
            console.log(err);
            next(err);
        }
    }
);
 
// passport 이용 안하고 바로 응답
router.post('/google', async(req, res, next) => {
    try {
        const tokenId = req.body.tokenId;
        console.log(tokenId);
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            requiredAudience: process.env.GOOGLE_CLIENT_ID
        });

        const { name, userID } = ticket.getPayload();
        
        const user = await User.findOne({
            where: {
                userID : userID
            }
        });
       
        if(user) {
            console.log(`${userID} found.`);
            
        }
        else {
            await User.create({
                userID : userID,
                password : "asdf", // 구글 로그인 시 비밀번호는 필요가 없게 됨
                nickname : name,
                coin : 0,
            }).then(user => console.log(`${userID} created.`));
        }

        const token = jwt.sign({
            userID: userID,
            nickname: name,
            // auth: user.auth
        }, 
        process.env.JWT_SECRET_KEY, 
        {
            expiresIn: '120s'
        });
        
        res.json({
            "token" : token
        });
        
    } catch(err) {
        console.log(err);
        next(err);
    }

});

module.exports = router;