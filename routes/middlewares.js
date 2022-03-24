// 현재 로그인 상태 파악

module.exports = {
    isLoggedIn : (req, res, next) => {
        if (req.headers.authorizationtoken) {
          next();
        } else {
          res.json({"message" : "로그인 필요"});
        }
    },
    isNotLoggedIn : (req, res, next) => {
        if (!req.headers.authorization) {
            next();
        } else {
            res.json({"message" : "로그아웃 필요"});
        }
    }
};
