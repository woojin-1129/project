
$("#btnFeedInsert").on("click",function(){
    let temp = document.feedFrm;
    temp.enctype = 'multipart/form-data';
    let frm = new FormData(temp);
    $.ajax({
        type : 'POST',
        url : '/feedRegister',
        contentType : false,
        processData : false,
        data : frm,
        success : function(msg){
            if (msg != '') alert(msg);
            $.post("/commandCk", "doc=" + temp.doc.value + "&logType=board", function (data) {
                if (data == "저장") {
                    $.get("/tierOneSelect", function (data) {
                        publishMessage(data.employeeNumber, "알림이 있어요", "notifications");
                    })
                }
            })
            temp.doc.value = "";
            publishMessageAll("새로고침", "board/" + temp.code.value + "/" + temp.querySelector(".topName").innerText);
        }
    });
    
})

function feedDelete(sno) {
    let temp = document.feedFrm;
    let param = "sno="+sno;
    $.get('/feedDelete',param,function(msg){
        if(msg !='')alert(msg)
        publishMessageAll("새로고침", "board/" + temp.code.value + "/" + temp.querySelector(".topName").innerText);
    })
}

function feedRepl(name, doc, tier) {
    let docZoon = document.querySelector("#feedDoc");
    docZoon.value = "";
    let temp = `'${name} ${tier}'님의 답글\n${doc}\n└> `;
    docZoon.value = temp;

    docZoon.focus();
}


$(".fileBtn").on("click",function(){
    $(".feedFile").click()
})

$(".feedFile").on("change", function () {
    const maxFileCount = 10;
    const selectedFiles = $(this)[0].files;
    const fileCount = selectedFiles.length;
    const fileChoiceList = $(".fileChoiceList");

    fileChoiceList.empty();

    if (fileCount > maxFileCount) {
        let msg = "파일은 최대 " + maxFileCount + "개까지 선택할 수 있습니다.";
        showMessage(msg);
        //alert(msg);
        $(this).val(""); // 선택한 파일 초기화
        $(".fileCount").text("파일 업로드");
        return;
    }

    $(".fileCount").text("선택한 파일 수: " + fileCount);

    if (fileCount < 1) {
        $(".fileCount").text("파일 업로드");
    }

    for (let i = 0; i < selectedFiles.length; i++) {
        const fileName = selectedFiles[i].name;
        const fileSize = selectedFiles[i].size;
        const listItem = $("<div>", { text: fileName + " (" + fileSize + " bytes)" });
        fileChoiceList.append(listItem);
    }
});

$(".fileCount").on("mouseover", function () {
    const fileCountOffset = $(this).offset();
    const leftPosition = fileCountOffset.left;
    const topPosition = fileCountOffset.top + $(this).height();

    $(".fileChoiceList").css({
        display: "block",
        left: (leftPosition + 130) + "px",
        bottom: (topPosition - 740) + "px"
    });

})

$(".fileCount").on("mouseout", function () {
    $(".fileChoiceList").css("display", "none");
});

$(".feedDownBtn").on("click", function () {
    let fileListsElement = $(this).closest(".fileLists");
    let sysFileName = fileListsElement.find(".sysFileName").text();
    let oriFileName = fileListsElement.find(".oriFileName").text();

    // 다운로드 링크 생성
    let downloadLink = document.createElement("a");
    downloadLink.href = "/upload/" + sysFileName; // 파일 경로 설정
    downloadLink.download = oriFileName; // 파일명 설정

    downloadLink.click();
});

$(".feedListBtn").on("click", function () {
    const overlay = document.createElement('div');
    const FeedListTool = document.createElement('div');
    let code = document.querySelector(".joinCode").value;
    let param = "code=" + code;
    let feedListZoon = this;
    let fff = "";
    $.get('/feedList', param, function (list) {
        for (let i = 0; i < list.length; i++) {
            let code = list[i].code;
            let name = list[i].feedListName;

            fff += `<div class="feedChoice" onclick="feedChoice('${code}')">
            ${name}
            </div>`;
        }
        overlay.classList.add('Overlay');

        document.body.appendChild(overlay);

        FeedListTool.innerHTML = fff;
        FeedListTool.classList.add('FeedList');

        //오른쪽에 툴팁을 위치
        const rect = feedListZoon.getBoundingClientRect();
        FeedListTool.style.top = (rect.top) + 'px';
        FeedListTool.style.left = (rect.right + 10) + 'px';

        document.body.appendChild(FeedListTool);

    })
})
function feedChoice(code) {
    //tool창 닫기
    let overlay = document.querySelector(".Overlay");
    let FeedListTool = document.querySelector(".FeedList")
    document.body.removeChild(overlay);
    document.body.removeChild(FeedListTool);

    let loginNumber = document.querySelector(".loginNumber").value;
    let feedName = document.querySelector(".feedName").value;
    let joinCode = document.querySelector(".joinCode").value;
    let param = "code=" + code + "&employeeNumber=" + loginNumber + "&feedName=" + feedName + "&joinCode=" + joinCode;
    $(".viewer").load("/mainListB", param);
}
$(document).ready(function () {
    //동적 핸들러작동을 위한 이벤트 위임
    $(".topR").on("click", ".magnifier", function () {
        $(".topR").html(`
    <div class="findStrList">
        <input type="text" class="findStr" placeholder="단어 검색"></input>
        <img src="/upload/find.png" class="magnifierR">
        <div class="upDown">
            <div class="findUp"> ▲ </div>
            <div class="findDown"> ▼ </div>
        </div>
        <div class="findOut"> X </div>
    </div>
    `);
    })

    $(".topR").on("input", ".findStr", function () {
        let maxLength = 10;
        let currentValue = $(this).val();

        if (currentValue.length > maxLength) {
            $(this).val(currentValue.slice(0, maxLength));
        }
    });

    $(".topR").on("click", ".findOut", function () {
        $(".doc mark, .oriFileName mark").contents().unwrap();
        $(".topR").html(`
        <img src="/upload/find.png" class="magnifier"></img>
    `);
    })

    let feedCount = -1;
    let highlightedDocs = $();

    $(".topR").on("click", ".magnifierR", function () {
        const searchTerm = document.querySelector(".findStr").value;
        highlightedDocs = $(".doc:contains('" + searchTerm + "'), .oriFileName:contains('" + searchTerm + "')");
        //:contains  jQuery의 메서드로 주어진 선택자나 텍스트를 가진 엘리먼트를 선택하는 역할

        // 기존 하이라이트 지우기
        $(".doc mark, .oriFileName mark").contents().unwrap();//선택한 엘리먼트의 자식 엘리먼트들을 해제(unwrap)하는 역할

        highlightedDocs.each(function () {  //.each 각요소를 순회한다(for을 쓰는 느낌?)
            const docText = $(this).text(); //요소중 하나를 의미
            const highlightedText = docText.replace(new RegExp(searchTerm, 'gi'), match => `<mark>${match}</mark>`);
            //replace(a,b)a를 b로 바꿈 , new RegExp(searchTerm, 'gi')정규표현식 객체
            $(this).html(highlightedText);//해당요소 교체
        });

        if (highlightedDocs.length < 1) {
            showMessage("찾는 글이 없습니다")
        }
        if (highlightedDocs.length > 0) {
            feedCount = 0;
            findScroll();
        }
    });

    $(".topR").on("click", ".findDown", function () {
        if (highlightedDocs.length < 1) {
            showMessage("찾는 글이 없습니다")
        }
        else if (feedCount <= 0) {
            showMessage("첫번째 글입니다.");
        }
        if (feedCount > 0) {
            feedCount--;
            findScroll();
        }
    });

    $(".topR").on("click", ".findUp", function () {
        if (highlightedDocs.length < 1) {
            showMessage("찾는 글이 없습니다")
        }
        else if (feedCount >= highlightedDocs.length - 1) {
            showMessage("마지막 글입니다.");
        }
        if (feedCount < highlightedDocs.length - 1) {
            feedCount++;
            findScroll();
        }
    });

    function findScroll() {
        const highlightedDoc = highlightedDocs.eq(feedCount);//몇번쨰인지 확인
        if (highlightedDoc.length > 0) {
            const offsetTop = highlightedDoc.offset().top;//offset().top 선택한 요소의 상단 위치
            const listCenter = $(".list").offset().top + $(".list").height() / 4;
            $(".list").scrollTop(offsetTop - listCenter + $(".list").scrollTop());
        }
    }

})

function showMessage(showMsg) {
    const msg = $("<div>", { class: "showMessage", text: showMsg });
    $(".showMessage").remove();
    $(".topR").append(msg); // 메시지 추가
    msg.fadeIn(500);

    setTimeout(function () {
        msg.fadeOut(500, function () {
            msg.remove(); // 메시지 제거
        });
    }, 1000);
}

var currentYear;
var currentMonth;
var startDate = new Date();
var endDate = new Date();

//켈린더 생성버튼
$(document).ready(function () {
    var headerHTML = "";
    let dateCode = document.querySelector(".code").value;
    let dateParam = "code=" + dateCode;

    $(".date").on("click", function () {

        $.get('/callDates', dateParam, function (datas) {
            markedDates = datas.map(function (data) {
                return data.creDay;
            });
            startDate = new Date(datas[0].creDay);
            endDate = new Date(datas[datas.length - 1].creDay);

            currentYear = endDate.getFullYear();
            currentMonth = endDate.getMonth();

            let fff = generateCalendar(currentYear, currentMonth, markedDates);
            const overlay = document.createElement('div');
            const FeedDatetool = document.createElement('div');

            overlay.classList.add('Overlay');
            document.body.appendChild(overlay);

            headerHTML = "";
            headerHTML = `
                <div id="header">
                    <div class="btnPrev">
                        <button id="prevBtns" onclick="prevYear()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" fill="none" class="bi bi-chevron-bar-left" viewBox="0 0 16 16">
							    <path fill-rule="evenodd" d="M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0zM4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5z" />
						    </svg>
                        </button>

                        <button id="prevBtn" onclick="prevDate()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" class="bi bi-chevron-left" viewBox="0 0 16 16">
							    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
						    </svg>
                        </button>
                    </div>
                    <h3>${currentYear} 년 ${currentMonth + 1} 월</h3>
                    <div class="btnNext">
                        <button id="nextBtn"  onclick="nextDate()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" class="bi bi-chevron-right" viewBox="0 0 16 16">
							    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
						    </svg>
                        </button>

                        <button id="nextBtns"  onclick="nextYear()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" fill="none" class="bi bi-chevron-bar-right" viewBox="0 0 16 16">
							    <path fill-rule="evenodd" d="M4.146 3.646a.5.5 0 0 0 0 .708L7.793 8l-3.647 3.646a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0zM11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z" />
						    </svg>
                        </button>
                    </div>
                    <button id="dateEndBtn"  onclick="dateEnd()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" fill="none" class="bi bi-file-excel-fill" viewBox="0 0 16 16">
                            <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5.884 4.68 8 7.219l2.116-2.54a.5.5 0 1 1 .768.641L8.651 8l2.233 2.68a.5.5 0 0 1-.768.64L8 8.781l-2.116 2.54a.5.5 0 0 1-.768-.641L7.349 8 5.116 5.32a.5.5 0 1 1 .768-.64z"/>
                        </svg>
                    </button>
                </div>`;

            FeedDatetool.innerHTML = headerHTML + fff; // Combine header and calendar
            FeedDatetool.classList.add('FeedDate');
            document.body.appendChild(FeedDatetool);

            btnHide()
        });
    })

})
//날짜형식
function formatDate(date) {
    var yyyy = date.getFullYear();
    var mm = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 1을 더합니다.
    var dd = String(date.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
}
//달력형식
function generateCalendar(year, month, markedDates) {
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var calendarHTML = '<div class="custom-calendar">';
    calendarHTML += '<div class="calendar-grid">';
    calendarHTML += '<div class="calendar-row">'
        + '<div class="calendar-cell">일</div>'
        + '<div class="calendar-cell">월</div>'
        + '<div class="calendar-cell">화</div>'
        + '<div class="calendar-cell">수</div>'
        + '<div class="calendar-cell">목</div>'
        + '<div class="calendar-cell">금</div>'
        + '<div class="calendar-cell">토</div>'
        + '</div>'
    var dayCounter = 1;
    for (var i = 0; i < 6; i++) {
        calendarHTML += '<div class="calendar-row">';
        for (var j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                calendarHTML += '<div class="calendar-cell"></div>';
            } else if (dayCounter <= daysInMonth) {
                var dateToCheck = new Date(year, month, dayCounter);
                var formattedDate = formatDate(dateToCheck);
                var isMarked = markedDates.includes(formattedDate);
                var dateStyle = isMarked ? 'dayBtn' : 'dayday';
                var dateClick = isMarked ? 'findDate(this)' : "";

                calendarHTML += `<div class="calendar-cell ${dateStyle}" onclick="${dateClick}">${dayCounter}</div>`;
                dayCounter++;
            } else {
                calendarHTML += '<div class="calendar-cell"></div>';
            }
        }
        calendarHTML += '</div>';
        if (dayCounter > daysInMonth) {
            break;
        }
    }

    calendarHTML += '</div></div>';
    return calendarHTML;
}

//달력업데이트
function updateCalendar() {
    $(".FeedDate").remove(); // 기존 달력 삭제
    var fff = generateCalendar(currentYear, currentMonth, markedDates);

    headerHTML = "";
    headerHTML = `
                <div id="header">
                    <div class="btnPrev">
                        <button id="prevBtns" onclick="prevYear()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" fill="none" class="bi bi-chevron-bar-left" viewBox="0 0 16 16">
							    <path fill-rule="evenodd" d="M11.854 3.646a.5.5 0 0 1 0 .708L8.207 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0zM4.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5z" />
						    </svg>
                        </button>

                        <button id="prevBtn" onclick="prevDate()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" class="bi bi-chevron-left" viewBox="0 0 16 16">
							    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
						    </svg>
                        </button>
                    </div>
                    <h3>${currentYear} 년 ${currentMonth + 1} 월</h3>
                    <div class="btnNext">
                        <button id="nextBtn"  onclick="nextDate()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" class="bi bi-chevron-right" viewBox="0 0 16 16">
							    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
						    </svg>
                        </button>

                        <button id="nextBtns"  onclick="nextYear()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" fill="none" class="bi bi-chevron-bar-right" viewBox="0 0 16 16">
							    <path fill-rule="evenodd" d="M4.146 3.646a.5.5 0 0 0 0 .708L7.793 8l-3.647 3.646a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0zM11.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z" />
						    </svg>
                        </button>
                    </div>
                    <button id="dateEndBtn"  onclick="dateEnd()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" class="bi bi-file-excel-fill" viewBox="0 0 16 16">
                            <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5.884 4.68 8 7.219l2.116-2.54a.5.5 0 1 1 .768.641L8.651 8l2.233 2.68a.5.5 0 0 1-.768.64L8 8.781l-2.116 2.54a.5.5 0 0 1-.768-.641L7.349 8 5.116 5.32a.5.5 0 1 1 .768-.64z"/>
                        </svg>
                    </button>
                </div>`;

    const FeedDatetool = document.createElement('div');
    FeedDatetool.innerHTML = headerHTML + fff; // Combine header and calendar
    FeedDatetool.classList.add('FeedDate');
    document.body.appendChild(FeedDatetool);

    btnHide();
}
// 이전 달로 이동
function prevDate() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
}
// 다음 달로 이동
function nextDate() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}
//이전년도
function prevYear() {
    currentYear--;
    if (currentYear === startDate.getFullYear() && currentMonth < startDate.getMonth()) {
        currentMonth = startDate.getMonth();
    }
    if (currentYear < startDate.getFullYear() && currentMonth > startDate.getMonth()) {
        currentYear++;
        currentMonth = startDate.getMonth();

    }
    updateCalendar();
}
//다음 년도
function nextYear() {
    currentYear++;
    if (currentYear === endDate.getFullYear() && currentMonth > endDate.getMonth()) {
        currentMonth = endDate.getMonth();

    }
    if (currentYear > endDate.getFullYear() && currentMonth < endDate.getMonth()) {
        currentYear--;
        currentMonth = endDate.getMonth();
    }
    updateCalendar();
}
//달력 종료
function dateEnd() {
    let overlay = document.querySelector(".Overlay");
    let FeedDatetool = document.querySelector(".FeedDate")
    document.body.removeChild(overlay);
    document.body.removeChild(FeedDatetool);
}
//날짜 찾기
function findDate(fff) {
    var dateValue = fff.innerText;
    dateEnd()
    var findDates = new Date(currentYear, currentMonth, parseInt(dateValue));
    var dayName = ['일', '월', '화', '수', '목', '금', '토'];
    const year = findDates.getFullYear();
    const month = String(findDates.getMonth() + 1).padStart(2, '0');
    const date = String(findDates.getDate()).padStart(2, '0');
    const searchDate = `---${year}년 ${month}월 ${date}일 (${dayName[findDates.getDay()]})---`

    highlightedDocs = $(".date:contains('" + searchDate + "')");


    highlightedDocs.each(function () {
        const highlightedDoc = highlightedDocs.eq(0);
        if (highlightedDoc.length > 0) {
            const offsetTop = highlightedDoc.offset().top;
            const listCenter = $(".list").offset().top + $(".list").height() / 10;
            $(".list").scrollTop(offsetTop - listCenter + $(".list").scrollTop());
        }
    });
}
//버튼숨기기
function btnHide() {
    if (currentYear === startDate.getFullYear() && currentMonth === startDate.getMonth()) {
        $('#prevBtn').hide();
    } else {
        $('#prevBtn').show();
    }

    // 다음 월 확인 버튼
    if (currentYear === endDate.getFullYear() && currentMonth === endDate.getMonth()) {
        $('#nextBtn').hide();
    } else {
        $('#nextBtn').show();
    }
    if (currentYear === startDate.getFullYear() && currentMonth === startDate.getMonth()) {
        $('#prevBtns').hide();
    } else {
        $('#prevBtns').show();
    }

    // 다음 월 확인 버튼
    if (currentYear === endDate.getFullYear() && currentMonth === endDate.getMonth()) {
        $('#nextBtns').hide();
    } else {
        $('#nextBtns').show();
    }
}
