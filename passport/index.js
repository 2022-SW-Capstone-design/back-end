
const passport = require('passport');
const local = require('./localStrategy');
const jwt = require('./jwt');

const User = require('../models/user');


module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.userID);
    });

    passport.deserializeUser((userID, done) => {
        User.findOne({
            where: {
                userID : userID
            }
        })
        .then( user => done(null, user))
        .catch( err => done(err));
    });

    jwt();
    local();
};