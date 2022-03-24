
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./passport');

dotenv.config();
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');

const app = express();
app.set('port', process.env.PORT || 8081); // 임시포트
passportConfig();


sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/myapp/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());



// db 테스트용 데이터 추가
const testQuery = require('./testQueries');

// John 생성 후 소설 2개와 각각 챕터 1개씩 생성
// testQuery.userCreate("John123", "asdf", "John", 0);
// testQuery.novelCreate("Harry Poter", "HELLO", "Fantasy", 1234, "John123", "cover-1234.png");
// testQuery.chapterCreate(1, "Chap1. name", "chap-1234-1.txt", 1234);
// testQuery.ownedCreate(1234, 1, "John123", true);
// testQuery.novelCreate("Harry Poter 2", "HELLOO", "Fantasy", 1235, "John123", "cover-1235.png");
// testQuery.chapterCreate(1, "Chap1. name2", "chap-1235-1.txt", 1235);
// testQuery.ownedCreate(1235, 1, "John123", true);

// Mike 생성 후 소설 1개와 챕터 1개 생성, John이 구입
// testQuery.userCreate("Mike123", "asdfq", "Mike", 0);
// testQuery.novelCreate("Spiderman 1", "HELLOO", "Action", 1236, "Mike123", "cover-1236.png");
// testQuery.chapterCreate(1, "Chap1. name", "chap-1236-1.txt", 1236);
// testQuery.ownedCreate(1236, 1, "Mike123", true);
// testQuery.ownedCreate(1236, 2, "John123", false);

// router 핸들링
app.use('/', indexRouter);
app.use('/auth', authRouter);

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
