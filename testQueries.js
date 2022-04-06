//테스트용 db 데이터 생성 모듈

const {
    User,
    Novel,
    Chapter,
    OwnedContent,
    LikedContent,
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
            console.error(err);
        }
    },

    novelCreate: async (User_id, title, description, genre, coverFileName, defaultPrice, rating) => {
        try {
            await Novel.create({
                User_id,
                title,
                description,
                genre,
                coverFileName,
                defaultPrice,
                rating
            }).then(console.log(`${title} created.`));
        } catch (err) {
            console.error(err);
            // throw err;
        }
    },

    chapterCreate: async (Novel_id, title, fileName, comment, price) => {
        try {
            await Chapter.create({
                Novel_id,
                title,
                fileName,
                comment,
                price
            }).then(console.log(`${title} created.`));

        } catch (err) {
            // throw err;
            console.error(err);
        }
    },

    ownedCreate: async (User_id, type, novelId, chapterId, contentId, own) => {
        try {
            await OwnedContent.create({
                User_id,
                type,
                novelId,
                chapterId,
                contentId,
                own
            }).then(console.log(`own created.`));
        } catch (err) {
            // throw err;
            console.error(err);
        }
    },

    illustCreate: async (Chapter_id, Chapter_Novel_id, userId, price, fileName, index, likes) => {
        try {
            await Illust.create({
                Chapter_id,
                Chapter_Novel_id,
                userId,
                price,
                fileName,
                index,
                likes
            }).then(console.log(`illust created.`));
        } catch (err) {
            // throw err;
            console.error(err);
        }
    },

    userCommentCreate: async (Chapter_id, Chapter_Novel_id, userId, content, rating) => {
        try {
            await UserComment.create({
                // id,
                Chapter_id,
                Chapter_Novel_id,
                userId, 
                content,
                rating,
            }).then(console.log(`user comment created.`));
        } catch (err) {
            // throw err;
            console.error(err);
        }
    },

    reportCreate: async (User_id, category, commentId, content, title, time, solved) => {
        try {
            await Report.create({
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
            console.error(err);
        }
    }
}
