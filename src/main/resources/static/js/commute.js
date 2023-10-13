// 이벤트 처리
if (tag(".btnFind")) {
    tag(".btnFind").addEventListener("click", signFind)
    tag(".findStr").addEventListener("keydown", key)
    tag(".totalList").addEventListener("click" , totalList)
    tag(".toDayList").addEventListener("click" , toDayList)
}

// 엔터키 이벤트
function key(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        signFind()
    }
}

// 처음 이전 1 2 3 4 다음 맨끝 에서 사용
function move(nowPage) {
    tag(".nowPage").value = nowPage;
    switch (tag(".toList").value) {
        case "1":
            toDayList()
            break;
        case "2":
            totalList()
            break;
    }
}

// 검색
function signFind() {
    move(1) // 검색 버튼이 클릭 되면 표시될 페이지는 무조건 1페이지
}

function totalList() {
    let param = "nowPage=" + tag(".nowPage").value + "&findStr=" + tag(".findStr").value
    $(".viewer").load("/commuteTotal", param, function () {
        tag(".toList").value = "2"
    });
}

function toDayList() {
    let param = "nowPage=" + tag(".nowPage").value + "&findStr=" + tag(".findStr").value
    $(".viewer").load("/commute", param, function () {
        tag(".toList").value = "1"
    });
}