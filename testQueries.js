//테스트용 db 데이터 생성 모듈

const { User, Novel, Chapter, Owned_contents} = require('./models');

module.exports = {
    userCreate : async (id, pw, nick, coin) => {
        await User.create({
            userID : id,
            password : pw,
            nickname : nick,
            coin : coin,
        }).then(console.log(`${id} created.`));
    },

    novelCreate : async (title, intro, genre, id, userid, cover) => {
        await Novel.create({
            novelTitle: title,
            novelDescription: intro,
            novelGenre: genre,
            novelID : id,
            User_userID : userid,
            coverFileName : cover,
        }).then(console.log(`${title} created.`));
    },

    chapterCreate : async (chapid, title, file, novelid) => {
        await Chapter.create({
            chapterID: chapid,
            chapterTitle: title,
            chapterFileName: file,
            Novel_novelID : novelid,
        }).then(console.log(`${title} created.`));
    },

    ownedCreate : async (novelid, chapid, userid, own) => {
        await Owned_contents.create({
            novelID: novelid,
            chapterID: chapid,
            User_userID: userid,
            own : own,
        }).then(console.log(`own created.`));
    },

}
