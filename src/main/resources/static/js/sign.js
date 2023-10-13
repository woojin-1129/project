// 이벤트 처리
if (tag(".btnFind")) {
    tag(".btnFind").addEventListener("click", signFind)
    tag(".btnSignRegister").addEventListener("click", signRegister)
    tag(".findStr").addEventListener("keydown", key)
}
if (tag(".signForm")) {
    tag(".signForm").addEventListener("change", formLoad)
    tag(".btnRegisterR").addEventListener("click", signRegisterR)
    tag(".btnRegisterTemp").addEventListener("click" , signTemp)
}

if (tag(".btnCk")) {
    tag(".btnCk").addEventListener("click", ck)
    tag(".btnRejection").addEventListener("click" , rejection)
}

if (tag(".btnSubmit")) {
    tag(".btnSubmit").addEventListener("click" , signSubmit)
    tag(".btnModify").addEventListener("click" , signModify)
    tag(".btnDelete").addEventListener("click" , signDelete)
}

if (tag(".btnModifyR")) {
    tag(".btnModifyR").addEventListener("click" , signModifyR)
}

$(".btnSignHome").on("click" , signHome)
// 엔터키 이벤트
function key(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        signFind()
    }
}

// 전자결제 페인페이지로
function signHome() {
    let param = "nowPage=" + tag(".nowPage").value + "&findStr=" + tag(".findStr").value
    $(".viewer").load("/signView", param);
}

// 처음 이전 1 2 3 4 다음 맨끝 에서 사용
function move(nowPage) {
    tag(".nowPage").value = nowPage;
    let param = "nowPage=" + nowPage + "&findStr=" + tag(".findStr").value
    $(".viewer").load("/signView", param);
}
// 검색
function signFind() {
    move(1) // 검색 버튼이 클릭 되면 표시될 페이지는 무조건 1페이지
}

// 작성 페이지 로드
function signRegister() {
    let param = "nowPage=" + tag(".nowPage").value + "&findStr=" + tag(".findStr").value
    $.post("/logInsert", "doc=전자결재 작성&logType=in")
    $(".viewer").load("/signRegister", param);
}

// 작성버튼 클릭시 DB전송
function signRegisterR() {
    if (tag(".signForm").value != "--양식을 선택하세요--") {
        let form = document.frm;
        switch (tag(".signForm").value) {
            case "지출결의서":
                let briefs = new Array();
                $(".briefs").each(function (index, item) {
                    briefs.push(item.value)
                })
                let amount = new Array();
                $(".amount").each(function (index, item) {
                    amount.push(item.value)
                })
                let note = new Array();
                $(".note").each(function (index, item) {
                    note.push(item.value)
                })

                $.ajax({
                    type: "POST",
                    url: "/signPaymentR",
                    data: {
                        "totAmount": form.totAmount.value,
                        "initiativeDate": form.initiativeDate.value,
                        "PaymentDate": form.PaymentDate.value,
                        "expenditure": form.expenditure.value,
                        "briefs": briefs,
                        "amount": amount,
                        "note" : note
                    },
                    datatype: "text",
                    success: function (msg) {
                        if (msg != "") {
                            alert(msg)
                            return;
                        }
                        $(".btnSignHome").click();
                    }
                })
                break;
            case "휴가계획서":
                $.ajax({
                    type: "POST",
                    url: "/signVacationR",
                    data: {
                        "startDate": form.startDate.value,
                        "endDate": form.endDate.value,
                        "doc": form.doc.value
                    },
                    datatype: "text",
                    success: function (msg) {
                        if (msg != "") {
                            alert(msg)
                            return;
                        }
                        $(".btnSignHome").click();
                    }
                })
                break;
        }
    }
}

// select 변경시 폼출력
function formLoad() {
    switch (tag(".signForm").value) {
        case "지출결의서":
            $(".form").load("/paymentForm")
            break;
        case "휴가계획서":
            $(".form").load("/vacationForm")
            break;
        default:
            let param = "nowPage=" + tag(".nowPage").value + "&findStr=" + tag(".findStr").value
            $(".viewer").load("/signRegister", param);
    }
}

// 지출결의서 금액 입력시 자동계산
function compute() {
    let totAmt = 0;
    $(".amount").each(function (index, item) {
        totAmt += parseInt(item.value)
    })
    tag(".totAmount").value = totAmt;
}

// 상세보기
function signView(sno, name, kind) {
    let param = "nowPage=" + tag(".nowPage").value + "&findStr=" + tag(".findStr").value + "&sno=" + sno + "&name=" + name;
    switch (kind) {
        case "지출결의서":
            $.post("/logInsert", "doc="+ sno + "번 지출결의서" + "&logType=in")
            $(".signView").load("/signPaymentView", param);
            break;
        case "휴가계획서":
            $.post("/logInsert", "doc=" + sno + "번 휴가계획서" + "&logType=in")
            $(".signView").load("/signVacationView", param);
            break;


    }
}

// 승인 버튼
function ck() {
    let param = "sno=" + tag(".sno").value
    $.get("/signCk" , param , function (msg) {
        if (msg == "승인처리중 오류") {
            alert(msg)
            return;
        }
        let id = [];
        id.push(msg);
        let size = $("input[name='plus']").length;
        for (let i = 0; i < size; i++) {
            id.push($("input[name='plus']").eq(i).val())
        }
        for (let i = 0; i < size; i++) {
            if (tag(".sessionNumber").value != id[i]) {
                let msg = `${tag(".sno").value}번 결재 ${tag(".kind").value}가 승인 되었습니다.`;
                publishMessage(id[i], msg, "notifications")
            }
        }
        $(".btnSignHome").click();
    })
}

// 반려 버튼 모달창
function rejection() {
    let modal = document.createElement("div")
    modal.setAttribute("class", "rejectionModal")

    let comment = document.createElement("div")
    comment.setAttribute("class", "rejectionComment")

    let hhh = document.createElement("h3")
    hhh.innerHTML = "반려사유"

    let textArea = document.createElement("textarea")
    textArea.setAttribute("class", "rejection")
    textArea.setAttribute("name", "rejection")
    
    let btnZone = document.createElement("div")
    btnZone.setAttribute("class" , "modalBtnZone")

    let btnRejectionR = document.createElement("button")
    btnRejectionR.setAttribute("class", "btnRejectionR")
    btnRejectionR.innerHTML = "반려"

    let btnModalDelete = document.createElement("button")
    btnModalDelete.setAttribute("class", "btnModalDelete")
    btnModalDelete.innerHTML = "취소"

    let emsp = document.createElement("span")
    emsp.innerHTML = "&emsp;"

    btnZone.appendChild(btnRejectionR);
    btnZone.appendChild(emsp)
    btnZone.appendChild(btnModalDelete);

    comment.appendChild(hhh);
    comment.appendChild(textArea)
    comment.appendChild(btnZone)
    modal.appendChild(comment);
    document.querySelector("body").appendChild(modal);

    signModalEvent()
}
// 반려 사유 모달창 이벤트 추가
function signModalEvent() {
    tag(".btnModalDelete").addEventListener("click", modalDelete)
    tag(".btnRejectionR").addEventListener("click" , rejectionR)
}
// 반려사유 취소버튼
function modalDelete() {
    tag(".rejectionModal").remove()
}

// 반려사유 반려버튼
function rejectionR() {
    $.ajax({
        type: "POST",
        url: "/rejectionR",
        data: {
            "sno": tag(".sno").value,
            "rejection": tag(".rejection").value
        },
        datatype: "text",
        success: function (msg) {
            if (msg != "") {
                alert(msg)
                return;
            }
            let id = [];
            let size = $("input[name='plus']").length;
            for (let i = 0; i < size; i++) {
                id.push($("input[name='plus']").eq(i).val())
            }
            for (let i = 0; i < size; i++) {
                if (tag(".sessionNumber").value != id[i]) {
                    let msg = `${tag(".sno").value}번 결재 ${tag(".kind").value}가 반려 되었습니다.`;
                    publishMessage(id[i], msg, "notifications")
                }
            }
            modalDelete();
            $(".btnSignHome").click();

        }
    })
}
// 반려 모달창
function rejectionDoc(sno) {
    if (!tag(".rejectionDocModal")) {
        let div = document.createElement("div")
        div.setAttribute("class", "rejectionDocModal")

        let hhh = document.createElement("h3")
        hhh.innerHTML = "반려사유"

        let textArea = document.createElement("textarea")
        textArea.setAttribute("class", "rejectionDoc")
        textArea.setAttribute("readonly", true);
        textArea.innerHTML = tag(".rejection"+sno).value

        div.appendChild(hhh)
        div.appendChild(textArea)
        tag(".a" + sno).appendChild(div)
    } else {
        tag(".rejectionDocModal").remove();
    }
    
}

// 임시저장
function signTemp() {
    if (tag(".signForm").value != "--양식을 선택하세요--") {
        let form = document.frm;
        switch (tag(".signForm").value) {
            case "지출결의서":
                let briefs = new Array();
                $(".briefs").each(function (index, item) {
                    briefs.push(item.value)

                })
                let amount = new Array();
                $(".amount").each(function (index, item) {
                    amount.push(item.value)
                })
                let note = new Array();
                $(".note").each(function (index, item) {
                    note.push(item.value)
                })

                $.ajax({
                    type: "POST",
                    url: "/signPaymentTemp",
                    data: {
                        "totAmount": form.totAmount.value,
                        "initiativeDate": form.initiativeDate.value,
                        "PaymentDate": form.PaymentDate.value,
                        "expenditure": form.expenditure.value,
                        "briefs": briefs,
                        "amount": amount,
                        "note": note
                    },
                    datatype: "text",
                    success: function (msg) {
                        if (msg != "") {
                            alert(msg)
                            return;
                        }
                        $(".btnSignHome").click();
                    }
                })
                break;
            case "휴가계획서":
                $.ajax({
                    type: "POST",
                    url: "/signVacationTemp",
                    data: {
                        "startDate": form.startDate.value,
                        "endDate": form.endDate.value,
                        "doc": form.doc.value
                    },
                    datatype: "text",
                    success: function (msg) {
                        if (msg != "") {
                            alert(msg)
                            return;
                        }
                        $(".btnSignHome").click();
                    }
                })
                break;
        }
    }
}

// 제출
function signSubmit() {
    $.post("/signSubmit", "sno=" + tag(".sno").value, function (msg) {
        if (msg != "") {
            alert(msg);
            return
        }
        $(".btnSignHome").click();
    })
}

// 수정
function signModify() {
    $.post("/logInsert", "doc=전자결재 수정&logType=in")
    let param = "nowPage=" + tag(".nowPage").value + "&findStr=" + tag(".findStr").value + "&sno=" + tag(".sno").value + "&kind=" + tag(".kind").value
    switch (tag(".kind").value) {
        case "지출결의서":
            $(".signView").load("/signPaymentModify" , param);
            break;
        case "휴가계획서":
            $(".signView").load("/signVacationModify", param);
            break;
    }
}

function signModifyR() {
    let form = document.frm
    switch (tag(".kind").value) {
        case "지출결의서":
            var formData = $(form).serialize();
            $.ajax({
                type: "POST",
                url: "/signPaymentModifyR",
                data: formData,
                datatype: "text",
                success: function (msg) {
                    if (msg != "") {
                        alert(msg)
                        return;
                    }
                    $(".btnSignHome").click();
                }
            })
            break;
        case "휴가계획서":
            var formData = $(form).serialize();
            $.ajax({
                type: "POST",
                url: "/signVacationModifyR",
                data: formData,
                datatype: "text",
                success: function (msg) {
                    if (msg != "") {
                        alert(msg)
                        return;
                    }
                    $(".btnSignHome").click();
                }
            })
            break;
    }
}



// 삭제
function signDelete() {
    let param = "sno=" + tag(".sno").value + "&kind=" + tag(".kind").value
    $.post("/signDelete", param, function (msg) {
        if (msg != "") {
            alert(msg);
            return
        }
        $(".btnSignHome").click();
    })
}