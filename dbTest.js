
const testQuery = require('./testQueries');

module.exports = async () => {

    // John 생성 후 소설 2개와 각각 챕터 1개씩 생성
    await testQuery.userCreate("john123@ajou.ac.kr", "asdf", "John", 0, 0)
    .then(testQuery.novelCreate("john123@ajou.ac.kr", "Harry Poter", "HELLO", "Fantasy", "cover-1234.png", 10, 4.4))
    .then(testQuery.chapterCreate(1, "Chap1. name321", "chap-888-1.md", null, 5))
    .then(testQuery.ownedCreate("john123@ajou.ac.kr", "chapter", 1, 1, null, true))
    .then(testQuery.novelCreate("john123@ajou.ac.kr", "Harry Poter 2", "HELLO2", "Fantasy", "cover-1235.png", 10, 4.1))
    .then(testQuery.chapterCreate(2, "Chap1. name321", "chap-888-2.md", null, 4))
    .then(testQuery.ownedCreate("john123@ajou.ac.kr", "chapter", 2, 1, null, true))
    // Mike 생성 후 소설 1개와 챕터 1개 생성, John이 구입
    .then(testQuery.userCreate("mike321@ajou.ac.kr", "asdf", "Mike", 0, 1))
    .then(testQuery.novelCreate("mike321@ajou.ac.kr", "Spider man", "HELLO", "Action", "cover-1236.png", 11, 4.2))
    .then(testQuery.chapterCreate(3, "Chap1. name1", "chap-999-1.md", null, 9))
    .then(testQuery.ownedCreate("John123@ajou.ac.kr", "chapter", 3, 1, null, false));
}
