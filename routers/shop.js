const router = require("express").Router();

//================================= ROUTER폴더로 API 관리하기 예제==============================

function logInConfirm(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send("로그인부터 해라....");
  }
}

router.get("/shop/shirts", logInConfirm, (req, res) => {
  res.send("셔츠셔츠셔츠셔츠셔츠");
});

router.get("/shop/pants", logInConfirm, (req, res) => {
  res.send("바지바지바지바지");
});

module.exports = router;
