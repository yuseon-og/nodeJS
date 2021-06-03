const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const MongoClient = require("mongodb").MongoClient;

let db;
let id = 7;

MongoClient.connect(
  "mongodb+srv://admin:admin1234@cluster0.gbnj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  (error, client) => {
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

    app.listen(8080, () => {
      console.log("listening on 8080 okok");
    });
  }
);

app.post("/add", (req, res) => {
  res.redirect("/write");

  db.collection("counter").findOne({ name: "게시물갯수" }, (error, result) => {
    console.log(result.totalPost);
    let idCounter = result.totalPost;
    db.collection("post").insertOne(
      { _id: idCounter, 제목: req.body.title, 날짜: req.body.date },
      (error, result) => {
        console.log("저장완료");
        db.collection("counter").updateOne(
          { name: "게시물갯수" },
          { $inc: { totalPost: 1 } },
          (error, result) => {
            if (error) {
              return console.log(error);
            }
            console.log("result");
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
  });
});

app.get("/list", (req, res) => {
  db.collection("post")
    .find()
    .toArray((error, result) => {
      console.log(result);
      res.render("list.ejs", { posts: result });
      // 디비에 저장된 post라는 collection 안의 어떤(모든, id가 뭐인, 제목이 뭐인)
      //데이터를 꺼내주세요
      // result는 여기 scope 내에서만 사용가능
    });
});

//POSTMAN TEST

app.get("/test", (req, res) => {
  db.collection("post")
    .find()
    .toArray((error, result) => {
      res.json(result);
    });
});

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.get("/write", (request, response) => {
  response.sendFile(__dirname + "/write.html");
});

// 어떤 사람이 / add 경로로 POST 요청을 하면...
// ~~~를 해주세요

// app.post("/add", (request, response) => {
//   response.send("complete");
//   console.log(request.body.title);
//   console.log(request.body.date);

// });

// 어떤 사람이 / add 라는 경로로 post 요청을 하면,
//     데이터 2개를(날짜, 제목) 보내주는데,
// 이 때 post라는 이름을 가진 collection에 저장하기
