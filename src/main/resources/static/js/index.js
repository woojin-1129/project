function tag(t) {
    return document.querySelector(t);
}

/* index 페이지 이벤트 처리 */
if (tag(".profileImg")) {
    tag(".profileImg").addEventListener("click", profileMenu);
    tag(".profileName").addEventListener("click", profileMenu);
    tag(".logoImg").addEventListener("click", home)

    tag(".sign").addEventListener("click", signView)
}

/* 인사관리 메뉴 이벤트 */
if (tag(".employeeManagement")) {
    tag(".attendance").addEventListener("click", commute)
}

/* 대표 메뉴 이벤트 */
if (tag(".bossZone")) {
    tag(".bossZone").addEventListener("click", bossZone)
}

// 프로필 메뉴 이벤트 추가
function profileMenuAddEvent() {
    tag(".btnEmployModify").addEventListener("click", profileModify)
    tag(".btnLogout").addEventListener("click", logout)
}
/* 프로필 수정창 */
function profileModify() {
    tag(".profileMenu").remove()
    color();
    $.post("/logInsert", "doc=프로필 수정&logType=in")
    $(".viewer").load("/profileModify");
}

/* 채팅창 키 이벤트 */
function chatSend(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        $(".btnChat").click();
    }
}

/* 페이지 로드시 사내 게시판으로 이동 */
$(".logoImg").ready(function () {
    $(".boardMain").click()
})

/* 프로필 누르면 메뉴생성 */
function profileMenu() {
    if (!tag(".profileMenu")) {
        let menu = document.createElement("div")
        menu.setAttribute("class", "profileMenu")

        let btn1 = document.createElement("button")
        btn1.setAttribute("type", "button")
        btn1.setAttribute("class", "btnEmployModify")
        btn1.innerHTML = "정보수정"

        /*         let btn2 = document.createElement("button")
                btn2.setAttribute("type", "button")
                btn2.setAttribute("class", "btnMyList")
                btn2.innerHTML = "내글보기" */

        let btn3 = document.createElement("button")
        btn3.setAttribute("type", "button")
        btn3.setAttribute("class", "btnLogout")
        btn3.innerHTML = "로그아웃"

        menu.appendChild(btn1)
        /*  menu.appendChild(btn2) */
        menu.appendChild(btn3)

        tag(".profile").appendChild(menu);

        profileMenuAddEvent();
    } else {
        tag(".profileMenu").remove()
    }
}

/* 공지게시판 페이지 로드 */
$(".notionBoard").on("click", function () {
    color();
    tag(".notionBoard").style.color = "#0080ff"
    tag(".notionBoardState").style.backgroundColor = "#e7f0fb"

    let stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/css/notion/notionList.css';
    document.head.appendChild(stylesheet);

    $(".viewer").load("/notionListR");
});

/* 사내게시판 페이지 로드 */
$(".boardMain").on("click", function () {
    color();
    tag(".boardMain").style.color = "#0080ff"
    tag(".boardMainState").style.backgroundColor = "#e7f0fb"

    let stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/css/board.css';
    document.head.appendChild(stylesheet);


    let feedName = "사내 게시판";
    $.post("/logInsert", "doc=" + feedName + "&logType=in")
    let param = "code=employee" + "&feedName=" + feedName;
    $(".viewer").load("/boardList", param);
})




/* 부서게시판 페이지 로드 */
$(".boardDepartment").on("click", function () {
    color();
    tag(".boardDepartment").style.color = "#0080ff"
    tag(".boardDepartmentState").style.backgroundColor = "#e7f0fb"

    let stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/css/board.css';
    document.head.appendChild(stylesheet);

    let feedName = "부서 게시판";
    $.post("/logInsert", "doc=" + feedName + "&logType=in")
    let param = "code=depart" + "&feedName=" + feedName;
    $(".viewer").load("/boardList", param);
})

/* 팀게시판 페이지 로드 */
$(".boardTeam").on("click", function () {
    color();
    tag(".boardTeam").style.color = "#0080ff"
    tag(".boardTeamState").style.backgroundColor = "#e7f0fb"

    let stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/css/board.css';
    document.head.appendChild(stylesheet);

    let feedName = "팀 게시판";
    $.post("/logInsert", "doc=" + feedName + "&logType=in")
    let param = "code=team" + "&feedName=" + feedName;
    $(".viewer").load("/boardList", param);
})
/* 받은쪽지함 페이지 로드 */
$("#index-btnGetNote").on("click", function () {
    color();
    tag(".index-getNote").style.color = "#0080ff"
    tag(".index-getNoteState").style.backgroundColor = "#e7f0fb"

    $.post("/logInsert", "doc=받은 쪽지함&logType=in")

    let getEmployee = $("#note-loginEmployee").val();
    $(".viewer").load("/get_note?getEmployee=" + getEmployee).css("display", "none");
    setTime(30);
});

/* 보낸쪽지함 페이지 로드 */
$("#index-btnSendNote").on("click", function () {
    color();
    tag("#index-btnSendNote").style.color = "#0080ff"
    tag(".index-btnSendNoteState").style.backgroundColor = "#e7f0fb"

    $.post("/logInsert", "doc=보낸 쪽지함&logType=in")

    let sendEmployee = $("#note-loginEmployee").val();
    $(".viewer").load("/send_note?sendEmployee=" + sendEmployee).css("display", "none");
    setTime(30);
});

// 안읽은 쪽지 갯수 업데이트 함수
function unRead() {
    let getEmployee = $("#note-loginEmployee").val();
    $.ajax({
        type: "GET",
        url: "/updateUnRead?getEmployee=" + getEmployee,
        success: function (unreadCount) {
            // 받아온 int 값을 업데이트
            $("#index-unRead").html(unreadCount);
        }
    });
}
$(document).ready(function () {
    unRead();
})


// index - 일정 메뉴 버튼
var calendarLoaded = false;   // 캘린더 중복 방지
// document.addEventListener('DOMContentLoaded', function () {
$("#index-btnCalendar").on("click", function () {    // 일정관리 페이지로
    if (calendarLoaded) {
        color();
        tag("#index-btnCalendar").style.color = "#0080ff"
        tag(".index-btnCalendarState").style.backgroundColor = "#e7f0fb"
        $(".viewer").load("/calendar");
    } else {
        color();
        tag("#index-btnCalendar").style.color = "#0080ff"
        tag(".index-btnCalendarState").style.backgroundColor = "#e7f0fb"
        $(".viewer").load("/calendar");
        calendarLoaded = true;
    }
});
// });


// 원래 스타일로 되돌림
function setTime(second) {
    setTimeout(function () {
        $(".viewer").css("display", "");
    }, second);
}

/* 투표 페이지 로드 */
$(".votingBoard").on("click", function () {
    color();
    tag(".votingBoard").style.color = "#0080ff"
    tag(".votingBoardState").style.backgroundColor = "#e7f0fb"

    let stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/css/vote/voteList.css';
    document.head.appendChild(stylesheet);

    $(".viewer").load("/voteList");
});


/* 전자결재 페이지 로드 */
function signView() {
    color();
    tag(".sign").style.color = "#0080ff"
    tag(".signState").style.backgroundColor = "#e7f0fb"

    let stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/css/sign/sign.css';
    document.head.appendChild(stylesheet);

    $(".viewer").load("/signView");
}

/* 조직도 페이지 로드 */
$(".ocView").on('click', function () {
    color();
    tag(".ocView").style.color = "#0080ff"
    tag(".ocViewState").style.backgroundColor = "#e7f0fb"
    $.post("/logInsert", "doc=조직도&logType=in")

    let stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/css/oc.css';
    document.head.appendChild(stylesheet);

    $('.viewer').load('/ocMain');
})

/* 사원관리 페이지 로드 */
$('.hrmView').on('click', function () {
    color();
    tag(".hrmView").style.color = "#0080ff"
    tag(".hrmViewState").style.backgroundColor = "#e7f0fb"
    $.post("/logInsert", "doc=사원관리&logType=in")

    let stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/css/hrm/hrmList.css';
    document.head.appendChild(stylesheet);

    $('.viewer').load('/hrmList');
})


/* 근태관리 페이지 로드 */
function commute() {
    color();
    tag(".attendance").style.color = "#0080ff"
    tag(".attendanceState").style.backgroundColor = "#e7f0fb"
    $.post("/logInsert", "doc=근태관리&logType=in")

    let stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/css/commute.css';
    document.head.appendChild(stylesheet);

    $(".viewer").load("/commute")
}

/* 기록열람 */
function bossZone() {
    color();
    tag(".bossZone").style.color = "#0080ff"
    tag(".bossZoneState").style.backgroundColor = "#e7f0fb"

    let stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/css/boss.css';
    document.head.appendChild(stylesheet);

    $(".viewer").load("/bossZone")
}

/*클릭시 출퇴근 현황이동 */
$(".workSelect").on("click", function () {
    color();
    $(".viewer").load("/workCommute");
});

/* 출근 */
$(".workGo").on("click", function () {
    $.get("/workPrint", function (msg) {
        if (msg != "") {
            alert(msg);
            return;
        }
        $.post("/workGo", function () { // 출근이 아니라면
            alert("출근완료"); // 출근처리
        });
    });
});


/* 퇴근 */
$(".workLeave").on("click", function () {
    $.get("/workExit", function (msg) {
        if (msg != "") {
            alert(msg);
            return;
        }
        $.post("/workLeave", function () {
            alert("퇴근완료");
        });
    });
});

/* 홈버튼 메인페이지로 */
function home() {
    location.href = "/"
}

// 로그아웃 구현
function logout() {
    $.get('/logoutR', function () {
        location.href = '/';
    });
}

/* 클릭시 색상 전체 초기화 */
function color() {
    let boardStylesheet = document.querySelector('link[href="/css/board.css"]');
    let commuteStylesheet = document.querySelector('link[href="/css/commute.css"]');
    let ocStylesheet = document.querySelector('link[href="/css/oc.css"]');
    let voteListStylesheet = document.querySelector('link[href="/css/vote/voteList.css"]');
    let hrmStylesheet = document.querySelector('link[href="/css/hrm/hrmList.css"]');
    let signStylesheet = document.querySelector('link[href="/css/sign/sign.css"]');
    let bossStylesheet = document.querySelector('link[href="/css/boss.css"]');
    let notionStylesheet = document.querySelector('link[href="/css/notion/notionList.css"]');
    let notionViewStylesheet = document.querySelector('link[href="/css/notion/notionView.css"]');


    // 스타일시트 요소를 제거합니다.
    if (boardStylesheet) {
        boardStylesheet.parentNode.removeChild(boardStylesheet);
    }
    if (commuteStylesheet) {
        commuteStylesheet.parentNode.removeChild(commuteStylesheet);
    }
    if (ocStylesheet) {
        ocStylesheet.parentNode.removeChild(ocStylesheet);
    }
    if (voteListStylesheet) {
        voteListStylesheet.parentNode.removeChild(voteListStylesheet);
    }
    if (signStylesheet) {
        signStylesheet.parentNode.removeChild(signStylesheet);
    }
    if (bossStylesheet) {
        bossStylesheet.parentNode.removeChild(bossStylesheet);
    }
    if (hrmStylesheet) {
        hrmStylesheet.parentNode.removeChild(hrmStylesheet);
    }
    if (notionStylesheet) {
        notionStylesheet.parentNode.removeChild(notionStylesheet)
    }
    if (notionViewStylesheet) {
        notionViewStylesheet.parentNode.removeChild(notionViewStylesheet)
    }

    tag(".notionBoard").style.backgroundColor = ""
    tag(".notionBoardState").style.backgroundColor = ""
    tag(".notionBoard").style.color = ""

    tag(".boardMain").style.backgroundColor = ""
    tag(".boardMainState").style.backgroundColor = ""
    tag(".boardMain").style.color = ""

    tag(".boardDepartment").style.backgroundColor = ""
    tag(".boardDepartmentState").style.backgroundColor = ""
    tag(".boardDepartment").style.color = ""

    tag(".boardTeam").style.backgroundColor = ""
    tag(".boardTeamState").style.backgroundColor = ""
    tag(".boardTeam").style.color = ""

    tag("#index-btnGetNote").style.backgroundColor = ""
    tag(".index-getNoteState").style.backgroundColor = ""
    tag(".index-getNote").style.color = ""

    tag("#index-btnSendNote").style.backgroundColor = ""
    tag(".index-btnSendNoteState").style.backgroundColor = ""
    tag("#index-btnSendNote").style.color = ""

    tag("#index-btnCalendar").style.backgroundColor = ""
    tag(".index-btnCalendarState").style.backgroundColor = ""
    tag("#index-btnCalendar").style.color = ""

    tag(".votingBoard").style.backgroundColor = ""
    tag(".votingBoardState").style.backgroundColor = ""
    tag(".votingBoard").style.color = ""

    tag(".sign").style.backgroundColor = ""
    tag(".signState").style.backgroundColor = ""
    tag(".sign").style.color = ""

    tag(".ocView").style.backgroundColor = ""
    tag(".ocViewState").style.backgroundColor = ""
    tag(".ocView").style.color = ""

    if (tag(".employeeManagement")) {
        tag(".hrmView").style.backgroundColor = ""
        tag(".hrmViewState").style.backgroundColor = ""
        tag(".hrmView").style.color = ""

        tag(".attendance").style.backgroundColor = ""
        tag(".attendanceState").style.backgroundColor = ""
        tag(".attendance").style.color = ""
    }
    if (tag(".bossZone")) {
        tag(".bossZone").style.backgroundColor = ""
        tag(".bossZoneState").style.backgroundColor = ""
        tag(".bossZone").style.color = ""
    }
}

/* 세션갱신 */
function refreshSession() {
    $.ajax({
        url: '/refresh-session',
        method: 'POST',
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.error('세션 갱신 중 오류 발생:', error);
        }
    });
}

// 주기적으로 세션을 갱신합니다.
setInterval(refreshSession, 2400000); // (600000 // 10분) 40분마다 세션 갱신 (밀리초 단위)