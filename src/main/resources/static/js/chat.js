/* index 페이지 이벤트 처리 */
if (tag(".chat")) {
    tag(".chat").addEventListener("click", chatView)
}

let userId = document.querySelector(".userId").value
// MQTT Broker 정보
const brokerUrl = "ws://0.tcp.jp.ngrok.io:17426/ws"; // RabbitMQ WebSocket URL // ngrok 에서 15675 번 포드 실행후 tcp 옆에것 붙여 넣으면됨
const clientId = userId; // 고유한 클라이언트 ID // 실행 할때는 https 말고 http 로 현상태로는 tls ssl 이 없어서 https 는 보안상의 이유로 작동하지 않음

// MQTT 연결 설정
const mqttClient = new Paho.MQTT.Client(brokerUrl, clientId);

// 연결 옵션 설정 (RabbitMQ에 맞게 설정)
const connectOptions = {
    useSSL: false, // TLS 사용 여부
    userName: "M", // RabbitMQ 사용자 이름
    password: "1111", // RabbitMQ 비밀번호
    keepAliveInterval: 30, // Keep Alive 간격을 초 단위로 설정
    onSuccess: onConnectSuccess, // 연결 성공 시 호출되는 콜백 함수
    onFailure: onConnectFailure, // 연결 실패 시 호출되는 콜백 함수
};

// 연결 시도
mqttClient.connect(connectOptions);

// 연결 성공 콜백
function onConnectSuccess() {
    console.log("Connected to MQTT broker");

    // 토픽 구독
    const allTopic = "All/#"
    mqttClient.subscribe(allTopic);
    const topic = "employees/" + userId + "/#"; // 구독할 토픽
    mqttClient.subscribe(topic);
    console.log("Subscribed to topic: " + topic);

    // 메시지 수신 처리
    mqttClient.onMessageArrived = onMessageArrived;
}

// 연결 실패 콜백
function onConnectFailure(err) {
    console.error("Failed to connect: " + err.errorMessage);
}

// 메시지 수신 처리
function onMessageArrived(message) {
    // 토픽에 따라 다른 클래스 추가
    if (message.destinationName.includes("/notifications")) {
        const notification = document.createElement("div");
        notification.className = "notification";
        notification.textContent = message.payloadString;
        notification.classList.add("notification-type");
        tag(".messageZone").appendChild(notification);
        notification.classList.add("show");

        // 알림을 일정 시간 후에 사라지게 처리
        setTimeout(function () {
            notification.classList.remove("show");
            setTimeout(function () {
                tag(".messageZone").removeChild(notification);
            }, 500);
        }, 5000); // 5초 후에 알림이 사라짐
    } else if (message.destinationName.includes("/messages/")) {
        if (tag("#myDiv")) {
            const topicParts = message.destinationName.split('/'); // 토픽을 '/'로 분리
            const roomId = topicParts[3];
            if (tag(".chatList")) {
                if (roomId == tag(".roomId").value) {
                    let chatList = tag(".chatList");
                    const userId = topicParts[4];
                    $.get("/chatUserSelect", "userId=" + userId, function (data) {
                        const chat = document.createElement("div");
                        chat.className = "youChat";

                        const chatImg = document.createElement("img");
                        chatImg.setAttribute("class", "ChatImg");
                        if (data.sysPhoto == null || data.sysPhoto == "") {
                            chatImg.setAttribute("src", "/upload/null.png");
                        } else {
                            chatImg.setAttribute("src", "/upload/" + data.sysPhoto);
                        }
                        chat.appendChild(chatImg);

                        const chatName = document.createElement("span");
                        chatName.setAttribute("class", "ChatName");
                        chatName.textContent = data.name;

                        const content = document.createElement("div");
                        content.setAttribute("class", "ChatContent");

                        content.appendChild(chatName);


                        const chatMessage = document.createElement("span");
                        chatMessage.className = "ChatMessage";
                        chatMessage.textContent = message.payloadString

                        const chatTime = document.createElement("span");
                        chatTime.setAttribute("class", "ChatTime");
                        let date = new Date();
                        let hours = date.getHours();
                        let minutes = date.getMinutes();
                        if (date.getHours() < 10) {
                            hours = "0" + date.getHours();
                        }
                        if (date.getMinutes() < 10) {
                            minutes = "0" + date.getMinutes();
                        }

                        let time = hours + ":" + minutes;
                        chatTime.textContent = time;

                        const info = document.createElement("div");
                        info.setAttribute("class", "ChatInfo");

                        info.appendChild(chatMessage);
                        info.appendChild(chatTime);

                        content.appendChild(info);

                        chat.appendChild(content);

                        chatList.appendChild(chat);

                        tag(".chatList").scrollTop = tag(".chatList").scrollHeight;
                    })
                } else {
                    messageReceived(message)
                }
            } else {
                messageReceived(message)
            }
        } else {
            messageReceived(message)
        }
    } else if (message.destinationName.includes("/board")) {
        /* 페이지 로드 */
        const topicParts = message.destinationName.split('/'); // 토픽을 '/'로 분리
        if (tag(".feedFrm")) {
            if (topicParts[2] == tag(".feedFrm").code.value) {
                let tempDoc = tag(".feedFrm").doc.value;
                let feedName = topicParts[3];
                $.post("/logInsert", "doc=" + feedName + "&logType=in")
                let param = "code="+ topicParts[2] + "&feedName=" + feedName;
                $(".viewer").load("/boardList", param, function () {
                    tag(".feedFrm").doc.value = tempDoc;
                });
            }
        }
    }
}

/* 메시지 알림 */
function messageReceived(message) {
    const topicParts = message.destinationName.split('/'); // 토픽을 '/'로 분리
    const receivedUserId = topicParts[1]; // userId가 두 번째 요소
    publishMessage(receivedUserId, "메시지가 도착했어요!", "notifications");
}


// 메시지 발행
function publishMessage(id, content, topicSuffix) {
    if (mqttClient.isConnected()) {
        const topic = "employees/" + id + "/" + topicSuffix; // 발행할 토픽
        const messagePayload = content; // 발행할 메시지 내용
        const message = new Paho.MQTT.Message(messagePayload);
        message.destinationName = topic;
        mqttClient.send(message);
    }
}

// 전체메시지 발행
function publishMessageAll(content, topicSuffix) {
    if (mqttClient.isConnected()) {
        const topic = "All/" + topicSuffix; // 발행할 토픽
        const messagePayload = content; // 발행할 메시지 내용
        const message = new Paho.MQTT.Message(messagePayload);
        message.destinationName = topic;
        mqttClient.send(message);
    }
}

/* 채팅창 전송 버튼 클릭시 */
function sendChat() {
    if (tag(".chatDoc").value == "") return;
    $.post("/commandCk", "doc=" + tag(".chatDoc").value + "&logType=chat", function (data) {
        if (data == "저장") {
            $.get("/tierOneSelect", function (data) {
                publishMessage(data.employeeNumber, "알림이 있어요", "notifications");
            })
        }
    })
    let size = $("input[name='postEmployeeNumber']").length;
    let employeeNumber = [];
    for (let i = 0; i < size; i++) {
        let temp = $("input[name='postEmployeeNumber']").eq(i).val();
        if (tag(".userId").value != temp) {
            employeeNumber.push(temp);
        }
    }
    let date = new Date();
    const chatList = tag(".chatList");
    $.get("/lastChat", "pSno=" + tag(".roomId").value, function (data) {
        let day = "";
        if ((date.getMonth() + 1) < 10) {
            if (date.getDate() < 10) {
                day = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-0" + date.getDate();
            } else {
                day = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-" + date.getDate();
            }
        } else {
            if (date.getDate() < 10) {
                day = date.getFullYear() + "-" + (date.getMonth() + 1) + "-0" + date.getDate();
            } else {
                day = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            }
        }
        if (data.creDate.substr(0, 10) != day) {
        
            const dateDiv = document.createElement("div");
            dateDiv.setAttribute("class", "dateDiv");
            dateDiv.textContent = day;
            chatList.appendChild(dateDiv);
        }
    })
    const chat = document.createElement("div");
    chat.setAttribute("class", "myChat");

    const content = document.createElement("div");
    content.setAttribute("class", "ChatContent");

    const info = document.createElement("div");
    info.setAttribute("class", "ChatInfo");

    const myChatMessage = document.createElement("span");
    myChatMessage.className = "ChatMessage";
    myChatMessage.textContent = tag(".chatDoc").value;

    const chatTime = document.createElement("span");
    chatTime.setAttribute("class", "ChatTime");
    let time = date.getHours() + ":" + date.getMinutes();
    chatTime.textContent = time;

    info.appendChild(myChatMessage);
    info.appendChild(chatTime);
    content.appendChild(info);
    chat.appendChild(content);
    chatList.appendChild(chat);

    let param = "pSno=" + tag(".roomId").value + "&employeeNumber=" + tag(".userId").value + "&doc=" + tag(".chatDoc").value;
    $.post("/sendMessage", param, function (data) {
        if (data != "") {
            alert(data)
            return;
        }
    })
    for (let i of employeeNumber) {
        let userId = i
        let docValue = document.querySelector(".chatDoc").value;
        publishMessage(userId, docValue, "messages/" + tag(".roomId").value + "/" + tag(".userId").value);
    }
    tag(".chatDoc").value = ""
    tag(".chatList").scrollTop = tag(".chatList").scrollHeight;
}

let lastChatPosition = { top: 60, left: 382 };
/* 채팅창 생성 */
function chatView() {
    if (tag("#myDiv")) {
        tag("#myDiv").remove();
    }
    $.get("/room", function (data) {
        const myDiv = document.createElement("div");
        myDiv.setAttribute("id", "myDiv");

        const myDivHeader = document.createElement("div");
        myDivHeader.setAttribute("id", "myDivHeader");
        myDivHeader.innerHTML = "메신저";

        const chatClose = document.createElement("img");
        chatClose.setAttribute("class", "chatClose");
        chatClose.setAttribute("src", "/upload/close.png");
        chatClose.addEventListener("click", closeChat);
        myDivHeader.appendChild(chatClose);

        const chatRoomCreate = document.createElement("img");
        chatRoomCreate.setAttribute("class", "chatRoomCreate");
        chatRoomCreate.setAttribute("src", "/upload/roomCreate.png");
        chatRoomCreate.addEventListener("click", chatRoomCreateClick);
        myDivHeader.appendChild(chatRoomCreate);

        myDiv.appendChild(myDivHeader);

        const chatView = document.createElement("div");
        chatView.setAttribute("class", "chatView");

        for (let i of data) {
            let room = document.createElement("div");
            room.setAttribute("class", "room");
            room.setAttribute("onclick", `roomIn(${i.roomId})`);
            room.innerHTML = i.roomTitle

            let nal = document.createElement("div");
            nal.setAttribute("class", "nal");
            nal.textContent = i.finalDate
            room.appendChild(nal);
            chatView.appendChild(room);
        }

        myDiv.appendChild(chatView);

        document.body.appendChild(myDiv);

        tag("#myDiv").style.top = lastChatPosition.top + "px";
        tag("#myDiv").style.left = lastChatPosition.left + "px";

        // Make the DIV element draggable:
        dragElement(tag("#myDiv"));
    })
}


/* 드래그 이벤트 */
function dragElement(element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(element.id + "Header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(element.id + "Header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        lastChatPosition.top = parseInt(tag("#myDiv").style.top);
        lastChatPosition.left = parseInt(tag("#myDiv").style.left);
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }

}
/* 채팅방 닫기 */
function closeChat() {
    if (tag("#myDiv")) {
        lastChatPosition.top = parseInt(tag("#myDiv").style.top);
        lastChatPosition.left = parseInt(tag("#myDiv").style.left);
        tag("#myDiv").remove();
    }
}
/* 초대창 닫기 */
function closeInvitePop() {
    if (tag(".invitePop")) {
        tag(".invitePop").remove();
    }
}
/* 채팅방 나가기 */
function roomOut() {
    $.get("/chatUserSelect", "userId=" + tag(".userId").value, function (data) {
        $.post("/roomOut", "roomId=" + tag(".roomId").value + "&employeeNumber=" + tag(".userId").value, function (msg) {
            if (msg != "") {
                alert(msg)
                return;
            }
            $.post("/sendMessage", "pSno=" + tag(".roomId").value + "&employeeNumber=" + tag(".userId").value + "&doc=" + data.name + "님이 채팅에서 니가셨습니다.")
            let emp = [];
            let size = $("input[name='postEmployeeNumber']").length;
            for (let i = 0; i < size; i++) {
                let temp = $("input[name='postEmployeeNumber']").eq(i).val();
                if (tag(".userId").value != temp) {
                    emp.push(temp);
                }
            }
            for (let i of emp) {
                let userId = i
                publishMessage(userId, data.name + "님이 채팅에서 니가셨습니다.", "messages/" + tag(".roomId").value + "/" + tag(".userId").value);
            }
            chatView();
        })
    })
}

/* 채팅방 개설 */
function chatRoomCreateClick() {
    if (tag(".chatView")) {
        tag(".chatView").remove();
    }

    const chatHome = document.createElement("img");
    chatHome.setAttribute("class", "chatHome");
    chatHome.setAttribute("src", "/upload/back.png");
    chatHome.addEventListener("click", chatView);
    tag("#myDivHeader").appendChild(chatHome);

    const chatViews = document.createElement("div");
    chatViews.setAttribute("class", "chatView");

    const chatList = document.createElement("div");
    chatList.setAttribute("class", "chatList");

    const roomC = document.createElement("div");
    roomC.setAttribute("class", "roomC");

    const roomTitle = document.createElement("input");
    roomTitle.setAttribute("type", "text");
    roomTitle.setAttribute("name", "roomTitle");
    roomTitle.setAttribute("class", "roomTitle");
    roomTitle.setAttribute("placeholder", "채팅방 이름을 입력하세요.");
    roomTitle.setAttribute("autocomplete", "off");
    roomC.appendChild(roomTitle);

    const btnRoomCreate = document.createElement("button");
    btnRoomCreate.setAttribute("type", "button");
    btnRoomCreate.setAttribute("class", "btnRoomCreate");
    btnRoomCreate.addEventListener("click", roomCreate)
    btnRoomCreate.textContent = "채팅방 개설";
    roomC.appendChild(btnRoomCreate);

    chatList.appendChild(roomC);
    chatViews.appendChild(chatList);
    tag("#myDiv").appendChild(chatViews)
}

function roomCreate() {
    $.post("/roomCreate", "roomTitle=" + tag(".roomTitle").value + "&employeeNumber=" + tag(".userId").value, function (data) {
        if (data != "") {
            alert(data)
            return;
        }
        chatView();
    })
}


/* 채팅방 입장 */
let date = "";
function roomIn(roomId) {
    if (tag(".invitePop")) {
        tag(".invitePop").remove();
    }
    if (tag(".chatRoomCreate")) {
        tag(".chatRoomCreate").remove();
    }
    const chatHome = document.createElement("div");
    chatHome.setAttribute("class", "chatHome");
    chatHome.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" class="bi bi-arrow-return-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"/>
        </svg>`
    chatHome.addEventListener("click", chatView);

    const chatClose = document.createElement("img");
    chatClose.setAttribute("class", "chatClose");
    chatClose.setAttribute("src", "/upload/close.png");
    chatClose.addEventListener("click", closeChat);

    const chatRoomOut = document.createElement("div");
    chatRoomOut.setAttribute("class", "chatRoomOut");
    chatRoomOut.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
        </svg>`;
    chatRoomOut.addEventListener("click", roomOut);


    tag("#myDivHeader").appendChild(chatHome);
    tag("#myDivHeader").appendChild(chatClose);
    tag("#myDivHeader").appendChild(chatRoomOut);

    $.get("/roomIn", "roomId=" + roomId, function (data) {
        tag(".chatView").remove();

        const chatViews = document.createElement("div");
        chatViews.setAttribute("class", "chatView");

        const chatList = document.createElement("div");
        chatList.setAttribute("class", "chatList");

        const roomIds = document.createElement("input");
        roomIds.setAttribute("type", "hidden");
        roomIds.setAttribute("name", "roomId");
        roomIds.setAttribute("class", "roomId");
        roomIds.setAttribute("value", roomId);
        chatList.appendChild(roomIds);

        for (let i of data) {
            if (i.creDate.substr(0, 10) != date) {
                const dateDiv = document.createElement("div");
                dateDiv.setAttribute("class", "dateDiv");
                dateDiv.textContent = i.creDate.substr(0, 10);
                chatList.appendChild(dateDiv);
                date = i.creDate.substr(0, 10);
            }

            if (i.employeeNumber == tag(".userId").value) {
                const chat = document.createElement("div");
                chat.setAttribute("class", "myChat");

                const content = document.createElement("div");
                content.setAttribute("class", "ChatContent");

                const info = document.createElement("div");
                info.setAttribute("class", "ChatInfo");

                const myChatMessage = document.createElement("span");
                myChatMessage.className = "ChatMessage";
                myChatMessage.textContent = i.doc

                const chatTime = document.createElement("span");
                chatTime.setAttribute("class", "ChatTime");
                let time = i.creDate
                time = time.substr(11, 5);
                chatTime.textContent = time;

                info.appendChild(myChatMessage);
                info.appendChild(chatTime);
                content.appendChild(info);
                chat.appendChild(content);
                chatList.appendChild(chat);
            } else {
                const chat = document.createElement("div");
                chat.className = "youChat";

                const chatImg = document.createElement("img");
                chatImg.setAttribute("class", "ChatImg");
                if (i.employees.sysPhoto == null || i.employees.sysPhoto == "") {
                    chatImg.setAttribute("src", "/upload/null.png");
                } else {
                    chatImg.setAttribute("src", "/upload/" + i.employees.sysPhoto);
                }
                chat.appendChild(chatImg);

                const chatName = document.createElement("span");
                chatName.setAttribute("class", "ChatName");
                chatName.textContent = i.employees.name;

                const content = document.createElement("div");
                content.setAttribute("class", "ChatContent");

                content.appendChild(chatName);


                const chatMessage = document.createElement("span");
                chatMessage.className = "ChatMessage";
                chatMessage.textContent = i.doc

                const chatTime = document.createElement("span");
                chatTime.setAttribute("class", "ChatTime");
                let time = i.creDate
                time = time.substr(11, 5);
                chatTime.textContent = time;

                const info = document.createElement("div");
                info.setAttribute("class", "ChatInfo");

                info.appendChild(chatMessage);
                info.appendChild(chatTime);

                content.appendChild(info);

                chat.appendChild(content);

                chatList.appendChild(chat);
            }
        }

        $.get("/roomCnt", "roomId=" + roomId, function (data) {
            for (let i of data) {
                let postEmployeeNumber = document.createElement("input");
                postEmployeeNumber.setAttribute("type", "hidden");
                postEmployeeNumber.setAttribute("name", "postEmployeeNumber");
                postEmployeeNumber.setAttribute("value", i.employeeNumber);

                chatList.appendChild(postEmployeeNumber);
            }
        })


        chatViews.appendChild(chatList);

        const invite = document.createElement("div");
        invite.setAttribute("class", "invite");
        invite.innerHTML = `
        <svg xmlns="" width="20" height="20" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
        </svg>`
        invite.addEventListener("click", inviteChat);



        chatViews.appendChild(invite);

        let chatDoc = document.createElement("textarea");
        chatDoc.setAttribute("class", "chatDoc");
        chatDoc.addEventListener("keydown", chatSend)
        chatViews.appendChild(chatDoc);

        let btnChat = document.createElement("button");
        btnChat.setAttribute("class", "btnChat");
        btnChat.innerHTML = "전송";
        btnChat.addEventListener("click", sendChat);
        chatViews.appendChild(btnChat);

        tag("#myDiv").appendChild(chatViews);
        tag(".chatList").scrollTop = tag(".chatList").scrollHeight;
    })
}

/* 초대버튼 */
function inviteChat() {
    if (!tag(".invitePop")) {
        const invitePop = document.createElement("div");
        invitePop.setAttribute("class", "invitePop");

        const invitePopHeader = document.createElement("div");
        invitePopHeader.setAttribute("class", "invitePopHeader");
        invitePopHeader.textContent = "초대";

        const inviteClose = document.createElement("img");
        inviteClose.setAttribute("class", "inviteClose");
        inviteClose.setAttribute("src", "/upload/close.png");
        inviteClose.addEventListener("click", closeInvitePop);
        invitePopHeader.appendChild(inviteClose);

        invitePop.appendChild(invitePopHeader);

        const invitePopView = document.createElement("div");
        invitePopView.setAttribute("class", "invitePopView");

        const inviteInput = document.createElement("input");
        inviteInput.setAttribute("type", "text");
        inviteInput.setAttribute("class", "inviteInput");
        inviteInput.setAttribute("placeholder", "초대받는 사람을 입력하세요.");
        inviteInput.addEventListener("input", inviteSearch);
        invitePopView.appendChild(inviteInput);

        invitePop.appendChild(invitePopView);


        tag("#myDiv").appendChild(invitePop);
    }
}

function inviteSearch() {
    if (tag(".inviteList")) {
        tag(".inviteList").remove();
    }
    let emp = [];
    let size = $("input[name='postEmployeeNumber'").length;
    for (let i = 0; i < size; i++) {
        emp.push($("input[name='postEmployeeNumber'").eq(i).val());
    }
    let find = tag(".inviteInput").value;
    if (find != "") {
        $.get("/inviteSearch", "find=" + find + "&emp=" + emp, function (data) {
            const inviteList = document.createElement("div");
            inviteList.setAttribute("class", "inviteList");
            for (let i of data) {
                const inviteItem = document.createElement("div");
                inviteItem.setAttribute("class", "inviteItem");

                const inviteImg = document.createElement("img");
                inviteImg.setAttribute("class", "inviteImg");
                if (i.sysPhoto == null || i.sysPhoto == "") {
                    inviteImg.setAttribute("src", "/upload/null.png");
                } else {
                    inviteImg.setAttribute("src", "/upload/" + i.sysPhoto);
                }
                inviteItem.appendChild(inviteImg);

                if (i.tier != 1) {
                    if (i.tier == 2) {
                        const inviteDepart = document.createElement("div");
                        inviteDepart.setAttribute("class", "inviteDepart");
                        inviteDepart.textContent = i.department.departName;
                        inviteItem.appendChild(inviteDepart);
                    } else {
                        const inviteTeam = document.createElement("div");
                        inviteTeam.setAttribute("class", "inviteTeam");
                        inviteTeam.textContent = i.team.teamName;
                        inviteItem.appendChild(inviteTeam);
                    }
                } else {
                    const inviteBoss = document.createElement("div");
                    inviteBoss.setAttribute("class", "inviteBoss");
                    inviteBoss.textContent = i.comName;
                    inviteItem.appendChild(inviteBoss);
                }

                const inviteName = document.createElement("div");
                inviteName.setAttribute("class", "inviteName");
                inviteName.textContent = i.name;
                inviteItem.appendChild(inviteName);

                const inviteTier = document.createElement("div");
                inviteTier.setAttribute("class", "inviteTier");
                inviteTier.textContent = i.tierCode.tierName;
                inviteItem.appendChild(inviteTier);

                const inviteEmployeeNumber = document.createElement("input");
                inviteEmployeeNumber.setAttribute("type", "hidden");
                inviteEmployeeNumber.setAttribute("name", "inviteEmployeeNumber");
                inviteEmployeeNumber.setAttribute("class", "inviteEmployeeNumber");
                inviteEmployeeNumber.setAttribute("value", i.employeeNumber);
                inviteItem.appendChild(inviteEmployeeNumber);

                inviteItem.setAttribute("onclick", `inviteItemClick(${i.employeeNumber})`);

                inviteList.appendChild(inviteItem);
            }
            tag(".invitePopView").appendChild(inviteList);
        })
    }
}

function inviteItemClick(employeeNumber) {
    $.post("/invite", "employeeNumber=" + employeeNumber + "&roomId=" + tag(".roomId").value, function (data) {
        if (data != "") {
            alert(data);
            return;
        }
        $.get("/chatUserSelect", "userId=" + employeeNumber, function (data) {
            $.post("/sendMessage", "pSno=" + tag(".roomId").value + "&employeeNumber=" + tag(".userId").value + "&doc=" + data.name + "님이 채팅에 참가하였습니다.")
            let emp = [];
            let size = $("input[name='postEmployeeNumber']").length;
            for (let i = 0; i < size; i++) {
                let temp = $("input[name='postEmployeeNumber']").eq(i).val();
                if (tag(".userId").value != temp) {
                    emp.push(temp);
                }
            }
            for (let i of emp) {
                let userId = i
                publishMessage(userId, data.name + "님이 채팅에 참가하였습니다.", "messages/" + tag(".roomId").value + "/" + tag(".userId").value);
            }
            const chatList = tag(".chatList");
            const postEmployeeNumber = document.createElement("input");
            postEmployeeNumber.setAttribute("type", "hidden");
            postEmployeeNumber.setAttribute("name", "postEmployeeNumber");
            postEmployeeNumber.setAttribute("value", employeeNumber);
            chatList.appendChild(postEmployeeNumber);

            const chat = document.createElement("div");
            chat.setAttribute("class", "myChat");

            const content = document.createElement("div");
            content.setAttribute("class", "ChatContent");

            const info = document.createElement("div");
            info.setAttribute("class", "ChatInfo");

            const myChatMessage = document.createElement("span");
            myChatMessage.className = "ChatMessage";
            myChatMessage.textContent = data.name + "님이 채팅에 참가하였습니다."

            const chatTime = document.createElement("span");
            chatTime.setAttribute("class", "ChatTime");
            let date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            if (date.getHours() < 10) {
                hours = "0" + date.getHours();
            }
            if (date.getMinutes() < 10) {
                minutes = "0" + date.getMinutes();
            }

            let time = hours + ":" + minutes;
            chatTime.textContent = time;

            info.appendChild(myChatMessage);
            info.appendChild(chatTime);
            content.appendChild(info);
            chat.appendChild(content);
            chatList.appendChild(chat);

            publishMessage(employeeNumber, "채팅에 초대되었습니다.", "notifications");
        })

    })
}


