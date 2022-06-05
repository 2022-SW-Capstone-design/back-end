
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./passport');
const hpp = require('hpp');
const helmet = require('helmet');

dotenv.config();
const { sequelize } = require('./models');
sequelize.sync({ force: false }) // true 시 DROP TABLE IF EXISTS 작동
    .then(() => {
        console.log('데이터베이스 연결 성공');
    }) 
    .catch((err) => {
        console.error(err);
    }); 
    
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const commentRouter = require('./routes/comment');
const reportRouter = require('./routes/report');
const likeRouter = require('./routes/like');
const purchasingRouter = require('./routes/purchasing');


const app = express();
app.set('port', process.env.PORT || 8081);
passportConfig();

 

if (process.env.NODE_ENV == 'production') {
    app.use(morgan('combined'));
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/myapp/public')));
app.use(express.static(path.join(__dirname, './uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/illust', express.static(path.join(__dirname, '/uploads/illusts')));
app.use('/music', express.static(path.join(__dirname, '/uploads/music')));
// app.use(formidable()); //postman error
app.use(passport.initialize());
 
// router 핸들링
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/comment', commentRouter);
app.use('/report', reportRouter);
app.use('/like', likeRouter);
app.use('/purchasing', purchasingRouter);

// no router
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// error router
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    // res.render('error');
    res.send(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});
