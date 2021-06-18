const express = require("express");
const app = express();

//.env 사용
require("dotenv").config();

// Put 사용 위한 라이브러리
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// session 인증 라이브러리

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const MongoClient = require("mongodb").MongoClient;

let db;
let id = 7;

MongoClient.connect(process.env.DB_URL, (error, client) => {
  if (error) {
    return console.log("error!!");
  }
  db = client.db("todoapp");

  // db.collection("post").insertOne(
  //   {_id: 2, 이름: "OK", 나이: 35},
  //   (error, result) => {
  //     console.log("저장완료");
  //   }
  // );

  app.listen(process.env.PORT, () => {
    console.log("listening on 8080 okok");
  });
});

app.post("/add", (req, res) => {
  res.redirect("/write");

  db.collection("counter").findOne({ name: "게시물갯수" }, (error, result) => {
    // console.log(result.totalPost);
    let idCounter = result.totalPost;
    db.collection("post").insertOne(
      { _id: idCounter, 제목: req.body.title, 날짜: req.body.date },
      (error, result) => {
        // console.log("저장완료");
        db.collection("counter").updateOne(
          { name: "게시물갯수" },
          { $inc: { totalPost: 1 } },
          (error, result) => {
            if (error) {
              return console.log(error);
            }
            console.log("로그인 된 경우 : ", req.user);
          }
        );
      }
    );
  });
});

app.delete("/delete", (req, res) => {
  console.log("delete request");
  console.log(req.body);
  req.body._id = parseInt(req.body._id);
  db.collection("post").deleteOne(req.body, (error, reuslt) => {
    console.log("삭제완료");
    res.status(200).send({ message: "성공했습니다." });
  });
});

app.get("/list", (req, res) => {
  db.collection("post")
    .find()
    .toArray((error, result) => {
      // console.log(result);
      res.render("list.ejs", { posts: result });
      // 디비에 저장된 post라는 collection 안의 어떤(모든, id가 뭐인, 제목이 뭐인)
      //데이터를 꺼내주세요
      // result는 여기 scope 내에서만 사용가능
    });
});
// =============================================

// 검색기능을

// 1. 정규식

// 2. text indexing

// 3. search indexing으로 3개 만들어 놓기

//1. 정규식
// app.get("/search", (req, res) => {
//   console.log(req.query.searchTerm);
//   let term = new RegExp(req.query.searchTerm);
//   console.log(term);
//   db.collection("post")
//     .find({ 제목: term })
//     .toArray((error, result) => {
//       console.log(result);
//       res.render("searchlist.ejs", { posts: result });
//     });
// });

// 2. text indexing

// app.get("/search", (req, res) => {
//   console.log(req.query.searchTerm);
//   db.collection("post")
//     .find({ $text: { $search: req.query.searchTerm } })
//     .toArray((error, result) => {
//       console.log(result);
//       res.render("searchlist.ejs", { posts: result });
//     });
// });

// 3. search indexing
app.get("/search", (req, res) => {
  console.log(req.query.searchTerm);
  let search = [
    {
      $search: {
        index: "title",
        text: {
          query: req.query.searchTerm,
          path: "제목", // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
        },
      },
    },
    { $sort: { _id: 1 } },
  ];

  db.collection("post")
    .aggregate(search)
    .toArray((error, result) => {
      console.log(result);
      res.render("searchlist.ejs", { posts: result });
    });
});

// =============================================

//POSTMAN TEST

// app.get("/test", (req, res) => {
//   db.collection("post")
//     .find()
//     .toArray((error, result) => {
//       res.json(result);
//     });
// });

app.get("/", (request, response) => {
  // response.sendFile(__dirname + "/index.html"); 쌩 html보내기
  response.render("index.ejs", {});
});

app.get("/write", (request, response) => {
  // response.sendFile(__dirname + "/write.html");쌩 html보내기
  response.render("write.ejs", {});
});

app.get("/detail/:id", (req, res) => {
  db.collection("post").findOne(
    { _id: parseInt(req.params.id) },
    (error, result) => {
      // console.log(error);
      // console.log(result);
      if (error) {
        return res.status(500).send({ message: "에러났습니다." });
      } else if (!result) {
        return res.status(404).send({ message: "데이터가 없습니다." });
      } else {
        return res.render("detail.ejs", { posts: result });
      }
    }
  );
});

app.get("/edit/:id", (req, res) => {
  db.collection("post").findOne(
    { _id: parseInt(req.params.id) },
    (error, result) => {
      // console.log(error);
      // console.log(result);
      if (error) {
        return res.status(500).send({ message: "에러났습니다." });
      } else if (!result) {
        return res.status(404).send({ message: "데이터가 없습니다." });
      } else {
        return res.render("edit.ejs", { posts: result });
      }
    }
  );
});

app.put("/edit", (req, res) => {
  // res.redirect("/list");

  db.collection("post").updateOne(
    { _id: parseInt(req.body.id) },
    {
      $set: {
        제목: req.body.title,
        날짜: req.body.date,
      },
    },
    (error, result) => {
      if (error) {
        return console.log(error);
      }
      console.log("업데이트 성공");
      res.redirect("/list");
    }
  );
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/fail", (req, res) => {
  res.render("fail.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/fail",
    //로그인 실패시 여기로 이동시켜주세요
  }),
  (req, res) => {
    res.redirect("/mypage");
  }
);

app.get("/mypage", logInConfirm, (req, res) => {
  res.render("mypage.ejs", { user: req.user });
});

// 로그인 했는지 확인하는 미들웨어

function logInConfirm(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send("로그인부터 해라....");
  }
}

// 아래는 아이디 비번 인증하는 세부코드

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true,
      passReqToCallback: false,
    },
    (userId, userPw, done) => {
      console.log(userId, userPw);

      db.collection("login").findOne({ id: userId }, (error, result) => {
        if (error) {
          return done(error);
        } else if (!result) {
          return done(null, false, { message: "존재하지 않는 아이디요" });
        } else if (userPw == result.pw) {
          return done(null, result);
        } else {
          return done(null, false, { message: "비번틀릿으요" });
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  db.collection("login").findOne({ id: userId }, (error, result) => {
    // console.log(error);
    // console.log(result);
    if (error) {
      return res.status(500).send({ message: "에러났습니다." });
    } else if (!result) {
      return res.status(404).send({ message: "데이터가 없습니다." });
    } else {
      return done(null, result);
    }
  });
});
