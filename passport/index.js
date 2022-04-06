
const passport = require('passport');
const local = require('./localStrategy');
const jwt = require('./jwt');

const User = require('../models/user');


module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.userId);
    });

    passport.deserializeUser((userId, done) => {
        User.findOne({
            where: {
                id : userId
            }
        })
        .then( user => done(null, user))
        .catch( err => done(err));
    });

    jwt();
    local();
};