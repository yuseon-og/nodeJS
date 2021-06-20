"use strict";

const chat1 = document.querySelector("#chat1");
const chat2 = document.querySelector("#chat2");

const chat11 = document.querySelector("#chat11");
const chat22 = document.querySelector("#chat22");

const nickname = document.querySelector("#nickname");
const chatlist = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");

chat1.addEventListener("click", () => {
  socket.emit("join", "chat1");
});

chat11.addEventListener("click", () => {
  socket.emit("leave", "chat1");
});

chat2.addEventListener("click", () => {
  socket.emit("join", "chat2");
});

chat22.addEventListener("click", () => {
  socket.emit("leave", "chat2");
});

const socket = io("/chat1");

// dom 선택

sendButton.addEventListener("click", () => {
  const param = {
    name: nickname.value,
    msg: chatInput.value,
  };

  socket.emit("chatting", param);
});
// 버튼눌러서 클릭 이벤트 발생하면
// param에 nickname.value와 chatInput.value 넣고
// socket.emit에서 보내는 파라메터에 객체형태로 넣어주기

// socket.emit("chatting", "from front");

// CSS로 송수신자 구분하기전 모듈
// socket.on("chatting", (msgFromServer) => {
//   console.log(msgFromServer);
//   const li = document.createElement("li");
//   li.innerText = `${msgFromServer.name}님이 보냄 : ${msgFromServer.msg}`;
//   chatlist.appendChild(li);
// });

// CSS로 송수신자 구분 후 모듈

socket.on("chatting", (msgFromServer) => {
  console.log(msgFromServer);
  const { name, msg, time } = msgFromServer;
  const msgItem = new msgModule(name, msg, time);

  msgItem.makeLi();
});

// 채팅 메시지 만드는 함수

function msgModule(name, msg, time) {
  this.name = name;
  this.msg = msg;
  this.time = time;

  this.makeLi = () => {
    const li = document.createElement("li");
    li.classList.add(nickname.value === this.name ? "sent" : "received");
    const htmlContent = ` <span class="profile">
        <span class="user">${this.name}</span>
        <img class="image" src="https://placeimg.com/50/50/any" alt="any">
    </span>
    <span class="message">${this.msg}</span>
    <span class="time">${this.time}</span>`;
    li.innerHTML = htmlContent;
    chatlist.appendChild(li);
    chatlist.lastChild.scrollIntoView(false);
  };
}
// console.log(socket);

// 이벤트 리스너로 보낼때 함수 실행
// 함수는 socket.emit
// 보내는 메시지는 객체 형태로
// nickname:
// msg:
// 이런식으로 하면 되지 않을까?

// 받아서 출력해줘야 하니까
// socket.on에서 메시지 받은거를
// ul 안에 li를 생성해서 넣어주면 되자나?
// li 생성 -> li.innerText에 msgFromServer 데이터 넣고
// chatlist.appendChid에 생성한 li 넣어주기
