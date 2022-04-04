//테스트용 db 데이터 생성 모듈

const {
    User,
    Novel,
    Chapter,
    OwnedContent,
    Illust,
    UserComment,
    Report
} = require('./models');

module.exports = {
    userCreate: async (id, password, nickname, coin, admin) => {
        try {
            await User.create({
                id,
                password,
                nickname,
                coin,
                admin
            }).then(console.log(`${id} created.`));
        } catch (err) {
            // throw err;
        }
    },

    novelCreate: async (id, User_id, title, description, genre, coverFileName, defaultPrice) => {
        try {
            await Novel.create({
                id,
                User_id,
                title,
                description,
                genre,
                coverFileName,
                defaultPrice
            }).then(console.log(`${title} created.`));
        } catch (err) {
            // throw err;
        }
    },

    chapterCreate: async (id, Novel_id, title, fileName, comment, price, likeCount) => {
        try {
            await Chapter.create({
                id,
                Novel_id,
                title,
                fileName,
                comment,
                price,
                likeCount
            }).then(console.log(`${title} created.`));

        } catch (err) {
            // throw err;
        }
    },

    ownedCreate: async (id, contentId, User_id, type, own) => {
        try {
            await OwnedContent.create({
                id,
                contentId,
                User_id,
                type,
                own
            }).then(console.log(`own created.`));
        } catch (err) {
            // throw err;
        }
    },

    illustCreate: async (id, Chapter_id, Chapter_Novel_id, price, fileName, index) => {
        try {
            await Illust.create({
                id,
                Chapter_id,
                Chapter_Novel_id,
                price,
                fileName,
                index
            }).then(console.log(`illust created.`));
        } catch (err) {
            // throw err;
        }
    },

    userCommentCreate: async (id, Chapter_id, Chapter_Novel_id, rating, content, likeCount) => {
        try {
            await UserComment.create({
                id,
                Chapter_id,
                Chapter_Novel_id,
                rating,
                content,
                likeCount
            }).then(console.log(`user comment created.`));
        } catch (err) {
            // throw err;
        }
    },

    ReportCreate: async (id, User_id, category, commentId, content, title, time, solved) => {
        try {
            await Report.create({
                id,
                User_id,
                category,
                commentId,
                content,
                title,
                time,
                solved
            }).then(console.log(`report created.`));
        } catch (err) {
            // throw err;
        }
    },
}
