var ajaxRequest = null;                               // ajax 중복실행 방지
var modal = document.getElementById('myModal');       // 쪽지쓰기 모달창
var viewModal = document.getElementById('viewModal'); // view 모달창

// 검색 기능
$("#btnSearch").on("click", function () {
  let findStr = $("#findStr").val();
  move(1, findStr);
})
$("#findStr").on("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // 기본 Enter 동작 막기
    $("#btnSearch").click(); // #btnSearch 버튼 클릭
  }
});


// 체크박스 핸들러
$(document).ready(function () {
  $(".checkAll").click(function () {
    if ($(".checkAll").is(":checked")) $("input[name=check]").prop("checked", true);
    else $("input[name=check]").prop("checked", false);
  });

  $("input[name=check]").click(function () {
    var total = $("input[name=check]").length;
    var checked = $("input[name=check]:checked").length;

    if (total != checked) $(".checkAll").prop("checked", false);
    else $(".checkAll").prop("checked", true);
  });
});



// 페이징 이벤트 처리
function move(nowPage, findStr) {
  let frm = document.frm;
  frm.nowPage.value = nowPage;
  let param = $(frm).serialize();
  
  // 이전 Ajax 요청을 취소하고 새로운 요청을 생성
  if (ajaxRequest !== null) {
    ajaxRequest.abort();
  }
  ajaxRequest = $.ajax({
    type: "GET",
    url: '/get_note',
    data: param,
    success: function (data) {
      $('#note-main').html(data);
      frm.findStr.value = findStr; // 검색어 다시 설정
      if (findStr) {
        $("#findStr").focus();       // 검색 후 포커스 설정
        const len = findStr.length;
        $("#findStr")[0].setSelectionRange(len, len);
      }
    }
  });
}



// 삭제 버튼 클릭 시
$("#btnDelete").on("click", function () {
  const checkedDivSnoInputs = $(".note-td.check input:checked");
  const snoArray = checkedDivSnoInputs.map(function () {
    return $(this).next(".divSno").val();
  }).get();
  if (snoArray.length === 0) {
    alert("삭제할 항목을 선택하세요.");
    return;
  }
  if (confirm("선택한 항목을 삭제하시겠습니까?")) {
    $.ajax({
      type: "POST",
      url: "/deleteNotes",
      contentType: "application/json",  // 컨텐츠 유형 설정
      data: JSON.stringify(snoArray),   // JSON 형식으로 변환하여 전송
      dataType: "json",
      success: function (data) {
        if (data.success) {
          alert(data.message);
          $("#index-btnGetNote").click();
        } else {
          alert(data.message);
        }
      }
    });
  }
});



// ---------------- 하단 전부 모달창 로직 ------------------

// 쪽지쓰기 버튼
$("#btnWrite").on("click", function () {
  modal.style.display = "block";
})


// 쪽지쓰기(모달창) - 받는사람 자동검색
$(function () {
  $("#inputAutocomplete").autocomplete({
    source: function (request, response) {
      $.ajax({
        url: "/autocomplete", // 백엔드 컨트롤러 주소
        dataType: "json",
        data: {
          term: request.term // 입력한 검색어
        },
        success: function (data) {
          response(data); // 검색어 자동완성 목록 반환
        }
      });
    },
    focus: function (event, ui) { // 방향키로 자동완성단어 선택 가능하게 만들어줌	
      return false;
    },
    minLength: 1 // 최소 입력 길이
  });
  // modal이 열릴 때 다시 영역 한정 (appendTo 옵션)
  $("#exampleModal").on("shown.bs.modal", function () {
    $("#inputAutocomplete").autocomplete("option", "appendTo", "#exampleModal")
  })
});



// 쪽지쓰기(모달창) - 보내기 버튼
$("#btnSend").on("click", () => {
  let sendEmployee = $("#note-sendEmployee").val(); // 보낸사람 사번 추출
  let temp = $("#inputAutocomplete").val();         // 받는사람 데이터 추출
  let regex = /(\d{8,})/;                           // 받는사람 사번 추출 (8자리 이상의 연속된 숫자)
  let match = temp.match(regex);
  let getEmployee = match[1];                       // 추출된 패턴
  let doc = $(".write-doc").val();                  // 내용 추출
  
  $.ajax({
    type: "POST",
    url: "/sendNote.do",
    data: {
      "getEmployee": getEmployee, "doc": doc, "sendEmployee": sendEmployee
    },
    dataType: "text",
    success: function () {
      modal.style.display = "none";
      move(1,null);
    }
  })
});


// 항목 클릭시 상세보기 view 모달창
function view(sno) {
  $.ajax({
    type: "GET",
    url: "/viewData?sno=" + sno,
    success: function (data) {
      // 모달 창에 값을 채워넣기
      $("#sendEmployee").val(data.sendEmployee);
      $("#recipient-name1").val(data.name + " (" + data.sendEmployee + ")");
      $("#recipient-name2").val(data.tierName);
      $("#recipient-name3").val(data.sendDate);
      $("#message-text").val(data.doc);
      viewModal.style.display = "block";
      $("#index-unRead").html(data.unRead);
    }
  });
}


// view - 답장하기버튼
$("#btnReply").on("click", function () {
  viewModal.style.display = "none";
  modal.style.display = "block";
  $(".getEmployee").val($("#recipient-name1").val());
})



// 모달창 "x" 버튼 , "취소" 버튼 , window 클릭시 모달창 close 핸들러 
$(".closeModal").on("click",function(){
  modal.style.display = "none";
  viewModal.style.display = "none";
})
$(".cancelView").on("click", function () {
  viewModal.style.display = "none";
})
$(".cancelNote").on("click", function () {
  modal.style.display = "none";
});

$(window).on("mousedown", function (event) {
  if (event.target == modal || event.target == viewModal) {
    modal.style.display = "none";
    viewModal.style.display = "none";
    move(document.frm.nowPage.value,null);
  }
});


