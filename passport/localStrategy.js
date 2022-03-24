
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
    }, async(email, password, done) => {
        try {
            const user = await User.findOne({
                where: {
                    userID : email
                }
            });
            if(user) {
                const result = await bcrypt.compare(password, user.password);
                if(result) {
                    done(null, user);
                }
                else {
                    done(null, false, {message : '비밀번호 불일치'});
                }
            }
            else {
                done(null, false, {message : '가입되지 않은 회원입니다'});
            }
        } catch(err) {
            console.log(err);
            done(error);
        }
    }));
};