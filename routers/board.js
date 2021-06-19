const router = require("express").Router();

function logInConfirm(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send("로그인부터 해라....");
  }
}

router.use(logInConfirm);

router.get("/sports", function (요청, 응답) {
  응답.send("스포츠 게시판");
});

router.get("/game", function (요청, 응답) {
  응답.send("게임 게시판");
});

module.exports = router;
