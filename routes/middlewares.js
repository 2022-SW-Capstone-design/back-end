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
    },
    verifyToken : (req, res, next) => {
        const bearerHeader = req.headers['authorization'];
        if(bearerHeader === undefined) {
            res.sendStatus(403);
        }

        const token = bearerHeader.split(' ')[1];
        req.token = token;
        
        next();
    }
};
