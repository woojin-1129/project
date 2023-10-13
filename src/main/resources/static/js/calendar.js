// calendar.js 전체

var dayHeaders = document.querySelectorAll('.fc-col-header-cell-cushion'); // 요일,색깔지정
var calendarModal = document.querySelector('#calendarModal'); // view 모달창
var indexSection = document.querySelector('.viewer');
var calendarEl = document.createElement('div');
var employeeNumber = $("#note-loginEmployee").val();
var departCode = $("#note-loginDepartCode").val();
var teamCode = $("#note-loginTeamCode").val();
var selectedView = 'all'; // 초기 기본 조회 조건
var params = {
  employeeNumber: employeeNumber,
  teamCode: teamCode,
  departCode: departCode
};

calendarEl.id = 'calendar';
indexSection.appendChild(calendarEl);


// 일정 생성시 랜덤컬러 지정
function getRandomColor() {
  var r = (Math.floor(Math.random() * 100) + 155).toString(16);
  var g = (Math.floor(Math.random() * 100) + 155).toString(16);
  var b = (Math.floor(Math.random() * 100) + 155).toString(16);
  return "#" + r + g + b;
}


// 요일,색깔지정
dayHeaders.forEach(function (header, index) {
  if (index === 0) {
    header.style.color = 'red';
  } else if (index === 6) {
    header.style.color = 'blue';
  }
});


// 일정추가
function insert(eventData) {
  $.ajax({
    type: "POST",
    url: "/calendar_addEvent",
    data: JSON.stringify(eventData),
    contentType: "application/json",
    success: function (response) {
      let startWithTimezone = new Date(eventData.start);
      startWithTimezone.setHours(startWithTimezone.getHours() - 9);
      let endWithTimezone = new Date(eventData.end);
      endWithTimezone.setHours(endWithTimezone.getHours() - 9);

      eventData.start = startWithTimezone;
      eventData.end = endWithTimezone;
      // DB에 생성된 ID 값을 받아와 eventData에 추가
      eventData.id = response;
      // 일정 추가 후 바로 캘린더에 표시
      calendar.addEvent(eventData);
    },
    error: function (error) {
      console.error("일정 추가 실패:", error);
    }
  });
  calendar.unselect();
}

var calendar = new FullCalendar.Calendar(calendarEl, {

  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
  },
  locale: "ko", // 한국어로 설정
  buttonText: {
    today: "오늘",
    month: "월",
    week: "주",
    day: "일",
    list: "목록"
  },
  editable: true,
  dayMaxEvents: true,
  navLinks: true,
  businessHours: true,
  selectable: true,
  nowIndicator: true,

  datesSet: function (dateInfo) {
  },

  // 캘린더 - 일정조회
  events: function (info, successCallback, failureCallback) {

    let isLogin = $("#note-loginEmployee").val();

    if (isLogin != "") {  // 로그인 여부

      // 일정 페이지 로드시 사번,부서명,팀명기준 전체일정 조회
      $.ajax({
        type: "GET",
        url: "/calendar_selectAll",
        data: params,
        traditional: true,
        success: function (data) {
          calendar.removeAllEvents(); // 데이터 중복방지
          var events = [];
          for (var i = 0; i < data.length; i++) {
            var event = data[i];
            events.push({
              id: event.id,
              title: event.title,
              start: event.start,
              end: event.end,
              backgroundColor: event.backgroundColor,
              allDay: event.allDay,
              textColor: event.textColor,
            });
          }
          successCallback(events);
        },
        error: function (error) {
          console.error("일정 조회 실패:", error);
          if (failureCallback) {
            failureCallback(error);
          }
        }
      });

      // 전체일정 조회
      $("#btnAllCalendar").on("click", function () {
        params = {
          employeeNumber: employeeNumber,
          teamCode: teamCode,
          departCode: departCode
        }
        $.ajax({
          type: "GET",
          url: "/calendar_selectAll",
          data: params,
          traditional: true,
          success: function (data) {
            calendar.removeAllEvents(); // 데이터 중복방지
            var events = [];
            for (var i = 0; i < data.length; i++) {
              var event = data[i];
              events.push({
                id: event.id,
                title: event.title,
                start: event.start,
                end: event.end,
                backgroundColor: event.backgroundColor,
                allDay: event.allDay,
                textColor: event.textColor,
              });
            }
            calendar.addEventSource(events); // 새 이벤트 추가
          },
          error: function (error) {
            console.error("일정 조회 실패:", error);
            if (failureCallback) {
              failureCallback(error);
            }
          }
        });
      })
      // 개인일정 조회
      $("#btnPersonal").on("click", function () {
        params = { employeeNumber: employeeNumber };

        $.ajax({
          type: "GET",
          url: "/calendar_selectAll",
          data: params,
          traditional: true,
          success: function (data) {
            calendar.removeAllEvents(); // 데이터 중복방지
            var events = [];
            for (var i = 0; i < data.length; i++) {
              var event = data[i];
              events.push({
                id: event.id,
                title: event.title,
                start: event.start,
                end: event.end,
                backgroundColor: event.backgroundColor,
                allDay: event.allDay,
                textColor: event.textColor,
              });
            }
            calendar.addEventSource(events); // 새 이벤트 추가
          },
          error: function (error) {
            console.error("일정 조회 실패:", error);
            if (failureCallback) {
              failureCallback(error);
            }
          }
        });
      });

      // 팀일정 조회
      $("#btnTeam").on("click", function () {
        params = { teamCode: teamCode };

        $.ajax({
          type: "GET",
          url: "/calendar_selectAll",
          data: params,
          traditional: true,
          success: function (data) {
            calendar.removeAllEvents(); // 데이터 중복방지
            var events = [];
            for (var i = 0; i < data.length; i++) {
              var event = data[i];
              events.push({
                id: event.id,
                title: event.title,
                start: event.start,
                end: event.end,
                backgroundColor: event.backgroundColor,
                allDay: event.allDay,
                textColor: event.textColor,
              });
            }
            calendar.addEventSource(events); // 새 이벤트 추가
          },
          error: function (error) {
            console.error("일정 조회 실패:", error);
            if (failureCallback) {
              failureCallback(error);
            }
          }
        });
      });

      // 부서일정 조회
      $("#btnDepartment").on("click", function () {
        params = { departCode: departCode };

        $.ajax({
          type: "GET",
          url: "/calendar_selectAll",
          data: params,
          traditional: true,
          success: function (data) {
            calendar.removeAllEvents(); // 데이터 중복방지
            var events = [];
            for (var i = 0; i < data.length; i++) {
              var event = data[i];
              events.push({
                id: event.id,
                title: event.title,
                start: event.start,
                end: event.end,
                backgroundColor: event.backgroundColor,
                allDay: event.allDay,
                textColor: event.textColor,
              });
            }
            calendar.addEventSource(events); // 새 이벤트 추가
          },
          error: function (error) {
            console.error("일정 조회 실패:", error);
            if (failureCallback) {
              failureCallback(error);
            }
          }
        });
      });
    }
  },


  // 일정추가
  select: function (arg) {
    calendarModal.style.display = "block";
    $("#selectType").on("change", function () {
      $("#calendarTitle").focus();
    });

    $("#btnCalendarAdd").off("click");   // 이전에 할당된 클릭 이벤트(중복) 제거

    $("#btnCalendarAdd").on("click", function () {
      var selectedValue = $("#selectType").val();
      var title = $("#calendarTitle").val();

      if (title) {
        var randomColor = getRandomColor();
        var startWithTimezone = new Date(arg.start);
        startWithTimezone.setHours(startWithTimezone.getHours() + 9);
        var endWithTimezone = new Date(arg.end);
        endWithTimezone.setHours(endWithTimezone.getHours() + 9);

        // 개인일정,팀일정,부서일정 구분
        var eventData = {
          title: title,
          "employeeNumber": selectedValue === "1" ? $("#note-loginEmployee").val() : "",
          "teamCode": selectedValue === "2" ? $("#note-loginTeamCode").val() : "",
          "departCode": selectedValue === "3" ? $("#note-loginDepartCode").val() : "",
          start: startWithTimezone,
          end: endWithTimezone,
          backgroundColor: randomColor,
          allDay: arg.allDay,
          textColor: "blue"
        };
        insert(eventData);  // 저장 함수
      }
      $("#calendarTitle").val("");  // Modal input 초기화
      calendarModal.style.display = "none";
    });
  },


  // 일정수정
  eventChange: function (obj) {
    var updatedEvent = obj.event;
    var startWithTimezone = new Date(updatedEvent.start);
    startWithTimezone.setHours(startWithTimezone.getHours() + 9);
    var endWithTimezone = new Date(updatedEvent.end);
    endWithTimezone.setHours(endWithTimezone.getHours() + 9);

    // 수정된 일정 정보를 서버로 전송하여 업데이트
    var eventData = {
      id: updatedEvent.id,
      title: updatedEvent.title,
      start: startWithTimezone,
      end: endWithTimezone,
      allDay: updatedEvent.allDay

    };
    $.ajax({
      type: "POST",
      url: "/calendar_modify",
      data: JSON.stringify(eventData),
      contentType: "application/json",
      success: function (response) {
      },
      error: function (error) {
        console.error("일정 수정 실패:", error)
      }
    })
  },


  // 일정 삭제
  eventClick: function (arg) {
    if (confirm(arg.event.title + ' 일정을 정말 삭제하시겠습니까?')) {
      $.ajax({
        type: "POST",
        url: "/calendar_delete",
        data: { id: arg.event.id }, // 객체로 감싸지 않고 그냥 전송
        success: function (response) {
        },
        error: function (error) {
          console.error("일정 삭제 실패:", error);
        }
      });
      arg.event.remove();
    }
  }

})
calendar.render();


// 모달창
$(".closeModal").on("click", function () {
  calendarModal.style.display = "none";
})

$(window).on("mousedown", function (event) {
  if (event.target == calendarModal) {
    calendarModal.style.display = "none";
  }
});

$("#calendarTitle").on("keydown", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $("#btnCalendarAdd").trigger("click");
  }
})
