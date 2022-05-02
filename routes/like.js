const express = require('express');
const router = express.Router();

//평론댓글에 좋아요 개수 1만큼 추가 / 이미 좋아요 상태라면 1 감소 (연수 테스트 ok)
router.post('/comment/:commentId',async(req,res,next)=>{//파라미터
    const id = req.params.commentId;//url로 req.body, req.prams res.query세개 구분?
    try{
      const query1=`UPDATE CriticComment SET likes = likes+1 WHERE
     (SELECT LikedContent.like FROM LikedContent WHERE id=${id})="0";`
      const query2=`UPDATE CriticComment SET likes = likes-1 WHERE
      (SELECT LikedContent.like FROM LikedContent WHERE id=${id})="1";`
     }catch(err){
      console.error(err);
      next(err);
    }
  res.end();
});

router.post('/illust/:illustId',async(req,res,next)=>{//파라미터
    const id = req.params.illustId;//url로 req.body, req.prams res.query세개 구분?
    try{
      const query1=`UPDATE illust SET likes = likes+1 WHERE
     (SELECT LikedContent.like FROM LikedContent WHERE id=${id})="0";`
      const query2=`UPDATE illust SET likes = likes-1 WHERE
      (SELECT LikedContent.like FROM LikedContent WHERE id=${id})="1";`
     }catch(err){
      console.error(err);
      next(err);
    }
  res.end();
});
router.post('/music/:musicId',async(req,res,next)=>{//파라미터
    const id = req.params.musicId;//url로 req.body, req.prams res.query세개 구분?
    try{
      const query1=`UPDATE music SET likes = likes+1 WHERE
     (SELECT LikedContent.like FROM LikedContent WHERE id=${id})="0";`
      const query2=`UPDATE music SET likes = likes-1 WHERE
      (SELECT LikedContent.like FROM LikedContent WHERE id=${id})="1";`
     }catch(err){
      console.error(err);
      next(err);
    }
  res.end();
});
  
module.exports = router;