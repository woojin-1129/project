if (tag(".btnAttendance")) {
    tag(".btnFind").addEventListener("click", bossFind)
    tag(".findStr").addEventListener("keydown", key)
    tag(".btnAttendance").addEventListener("click", bossAttendance)
    tag(".btnDoc").addEventListener("click", bossDoc)
}


// 엔터키 이벤트
function key(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        bossFind()
    }
}

// 처음 이전 1 2 3 4 다음 맨끝 에서 사용
function move(nowPage, ty) {
    tag(".nowPage").value = nowPage;
    let param = "nowPage=" + nowPage + "&findStr=" + tag(".findStr").value + "&ty=" + ty;
    switch (ty) {
        case "":
            $(".viewer").load("/bossZone", param);
            break;
        case "doc":
            $(".viewer").load("/bossDoc", param);
            break;
        case "att":
            $(".viewer").load("/bossAttendance", param);
            break;
    }
}
// 검색
function bossFind() {
    move(1, "") // 검색 버튼이 클릭 되면 표시될 페이지는 무조건 1페이지
}

function bossDoc() {
    move(1, "doc")
}

function bossAttendance() {
    move(1, "att")
}