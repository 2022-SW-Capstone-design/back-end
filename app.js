
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
app.use(express.static(path.join(__dirname, './uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());



// db 테스트용 데이터 추가
const testQuery = require('./testQueries');

// John 생성 후 소설 2개와 각각 챕터 1개씩 생성
testQuery.userCreate("john123@ajou.ac.kr", "asdf", "John", 0, 0);
testQuery.novelCreate(777, "john123@ajou.ac.kr", "Harry Poter", "HELLO", "Fantasy", "cover-1234.png", 10);
testQuery.chapterCreate(123, 777, "Chap1. name1", "chap-777-1.md", null, null, 3);
testQuery.ownedCreate(1, 123, "john123@ajou.ac.kr", "chapter", true);
testQuery.novelCreate(888, "john123@ajou.ac.kr", "Harry Poter 2", "HELLO2", "Fantasy", "cover-1235.png", 10);
testQuery.chapterCreate(456, 777, "Chap2. name2", "chap-888-1.md", null, 8, 4);
testQuery.ownedCreate(2, 456, "john123@ajou.ac.kr", "chapter", true);

// Mike 생성 후 소설 1개와 챕터 1개 생성, John이 구입
// testQuery.userCreate("Mike123", "asdfq", "Mike", 0);
// testQuery.novelCreate("Spiderman 1", "HELLOO", "Action", 1236, "Mike123", "cover-1236.png");
// testQuery.chapterCreate(1, "Chap1. name", "chap-1236-1.txt", 1236);
// testQuery.ownedCreate(1236, 1, "Mike123", true);
// testQuery.ownedCreate(1236, 2, "John123", false);
testQuery.userCreate("mike321@ajou.ac.kr", "asdf", "Mike", 0, 1);
testQuery.novelCreate(999, "mike321@ajou.ac.kr", "Spider man", "HELLO", "Action", "cover-1236.png", 11);
testQuery.chapterCreate(789, 999, "Chap1. name1", "chap-999-1.md", null, null, 3);
testQuery.ownedCreate(3, 789, "John123@ajou.ac.kr", "chapter", false);



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
