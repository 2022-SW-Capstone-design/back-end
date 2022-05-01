
//bearer token 인증

const passport = require('passport');
const { User } = require('../models');
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');

module.exports = ()  => {
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
        //secretOrKey: process.env.JWT_SECRET_KEY,
        secretOrKey: '1234'
    }, async(jwtPayload, done) => {
        try {
            console.log(`jwt email :${jwtPayload.userId}`);
            const user = await User.findOne({
                where: {
                    id : jwtPayload.userId
                }
            });
            if(user) {
                return done(null, user);
            }
            else {
                done(null, false, { reason: '잘못된 인증정보 입니다' });
            }
        } catch(err) {
            console.log(err);
            done(err);
        }
    }))
};
