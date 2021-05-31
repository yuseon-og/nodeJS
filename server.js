const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;

let db;

MongoClient.connect(
  "mongodb+srv://admin:admin1234@cluster0.gbnj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  (error, client) => {
    if (error) {
      return console.log("error!!");
    }
    db = client.db("todoapp");

    db.collection("post").insertOne(
      { _id: 2, 이름: "OK", 나이: 35 },
      (error, result) => {
        console.log("저장완료");
      }
    );

    app.listen(8080, () => {
      console.log("listening on 8080 okok");
    });
  }
);

app.get("/pet", (request, response) => {
  response.send("PET 쇼핑입니다.");
});

app.get("/beauty", (request, response) => {
  response.send("beauty 쇼핑입니다.");
});

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.get("/write", (request, response) => {
  response.sendFile(__dirname + "/write.html");
});

// 어떤 사람이 / add 경로로 POST 요청을 하면...
// ~~~를 해주세요

app.post("/add", (request, response) => {
  response.send("complete");
  console.log(request.body.title);
  console.log(request.body.date);
  // DB에 저장해주세요~~~ 추가예정
});

// 어떤 사람이 / add 라는 경로로 post 요청을 하면,
//     데이터 2개를(날짜, 제목) 보내주는데,
// 이 때 post라는 이름을 가진 collection에 저장하기
