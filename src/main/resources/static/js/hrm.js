$(".preview").on('click', function () {
    tag(".attFile").click();
})
$(".attFile").on('change', preview)

$(".findStr").on("keydown", function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        search();
    }
})

//다음카카오 우편기능 API
$('.btnZipcode').on('click', function () {
    let frm = document.frmHrm;
    new daum.Postcode({
        oncomplete: function (data) {
            frm.zipcode.value = data.zonecode //우편번호
            frm.address1.value = data.address  //주소
        }
    }).open();
})

//페이징 기능
function move(nowPage) {
    let frm = document.frmHrm;
    frm.nowPage.value = nowPage;
    let param = $(frm).serialize();
    $('#hrmMain').load('/hrmList', param);
}
$('.btnFind').on('click', search)
function search() {
    move(1); // 검색 버튼이 클릭되면 표시 될 페이지는 무조건 1페이지 부터여야 함
}
// 상세보기 이동
function view(sno) {
    let param = "sno=" + sno;
    $.get("/hrmNameSelect", param, function (data) {
        $.post("/logInsert", "doc=("+ data.employeeNumber + ") " + data.name + "의 사원정보&logType=in")
    })
    $('#hrmMain').load('/hrmView', param);
}


// 등록창 이동
$('.btnRegister').on('click', function () {
    let frm = document.frmHrm;
    let param = $(frm).serialize();
    $.post("/logInsert", "doc=사원등록&logType=in")
    $('#hrmMain').load('/hrmRegister', param);
})

if (tag(".departC")) {
    tag(".tier").addEventListener("change", depart)
    tag(".tier").addEventListener("change", dirNum)
    tag(".departCode").addEventListener("change", dirNum)
    tag(".teamCode").addEventListener("change", dirNum)
}

// 직속사수 출력
function dirNum() {
    let tier = document.querySelector('.tier').value;
    let depart = "";
    let team = "";
    if (tag(".departCode")) {
        depart = document.querySelector('.departCode').value;
    }
    if (tag(".teamCode")) {
        team = document.querySelector('.teamCode').value;
    }

    if (tier !== null && depart !== null && team !== null) {
        let param = "tier=" + tier + "&departCode=" + depart + "&teamCode=" + team;

        $.get("/dirNumber", param, function (dirNumber) {
            document.querySelector('.dirNumber').value = dirNumber;
        });
    }
}

// 등록시 부서명설정에 따른 팀목록 불러오기
$('.departCode').on('change', departTeam) 
function departTeam() {
    let departName = $(".departCode").val(); // 선택된 부서 코드 가져오기
    let teamNameSelect = $('.teamCode'); // 팀 선택 옵션 엘리먼트

    let tier = document.querySelector('.tier').value;;
    if(tier == 2) {
        return;
    }

    // 서버로 해당 부서에 속한 팀 목록 요청
    $.get('/teamName', { departName: departName }, function (teamList) {
        // 팀 선택 옵션 초기화 후 새로운 팀 목록 추가
        teamNameSelect.empty();
        for (let i = 0; i < teamList.length; i++) {
            let option = $('<option>');
            option.attr('value', teamList[i].teamCode);
            option.text(teamList[i].teamName);
            teamNameSelect.append(option);
        }


        // 팀 목록이 업데이트되었을 때 teamCode 변수를 업데이트
        let selectedTeamCode = teamNameSelect.val();
        teamCode = selectedTeamCode;
        dirNum();
    });
}

function preview(ev) {
    if (ev.target.files && ev.target.files[0]) {
        let previewImage = tag(".imagePreview")
        var file = ev.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = reader.result
        };
        reader.readAsDataURL(file);
    }
}



// 저장기능
$('.btnRegisterR').on('click', function () {
    let temp = document.frmHrm;
    temp.enctype = 'multipart/form-data';
    let frm = new FormData(temp);

    $.ajax({
        type: 'POST',
        url: '/hrmRegisterR',
        contentType: false,
        processData: false,
        data: frm,
        success: function (msg) {
            if (msg !== '') {
                confirm(msg);
            }
            $('#hrmMain').load("/hrmList")
        }
    });
});


// delete 삭제
$('.btnDelete').on('click', function () {
    let param = $('.frmHrm').serialize();
    $.get('/hrmDeleteR', param, function (msg) {
        if (msg != '') alert(msg);
        $('#hrmMain').load("/hrmList", param)
    })
})

// modify버튼
$('.btnModify').on('click', function () {
    let param = $('.frmHrm').serialize();
    $('#hrmMain').load('/hrmModify', param);
})

//수정하기
$('.btnModifyR').on('click', function () {
    let temp = document.frmHrm;
    temp.enctype = 'multipart/form-data';
    let frm = new FormData(temp)

    $.ajax({
        type: 'POST',
        url: '/hrmModifyR',
        contentType: false,
        processData: false,
        data: frm,
        success: function (msg) {
            if (msg != '') {
                alert(msg)
            }
            $('.hrmView').click();
        }
    })
})
//목록버튼
$('.btnList').on('click', function () {
    $('#hrmMain').load('/hrmList');
})

/* 직급변경시 부서 선택창 */
function depart() {
    let tier = tag(".tier").value;
    if (tag(".departCode")) {
        tag(".departCode").remove();
    }
    if (tag(".teamCode")) {
        tag(".teamCode").remove();
    }
    if (tier == 1) {
        let departSelect = document.createElement("select");
        departSelect.setAttribute("class", "departCode");
        departSelect.setAttribute("name", "departCode");

        let departOption = document.createElement("option");
        departOption.setAttribute("value", "departAll");
        departOption.innerHTML = "&emsp;&emsp;&emsp;";
        departSelect.appendChild(departOption);

        tag(".departC").appendChild(departSelect);

        let teamSelect = document.createElement("select");
        teamSelect.setAttribute("class", "teamCode");
        teamSelect.setAttribute("name", "teamCode");

        let teamOption = document.createElement("option");
        teamOption.setAttribute("value", "teamAll");
        teamOption.innerHTML = "&emsp;&emsp;&emsp;";
        teamSelect.appendChild(teamOption);

        tag(".teamC").appendChild(teamSelect);

    } else if (tier == 2) {
        let departSelect = document.createElement("select");
        departSelect.setAttribute("class", "departCode");
        departSelect.setAttribute("name", "departCode");
        departSelect.addEventListener("change", departTeam);
        departSelect.addEventListener("change", dirNum);
        let selectOptionD = document.createElement("option");
        selectOptionD.setAttribute("value", "departAll");
        selectOptionD.textContent = "*부서를 선택하시요.";
        departSelect.appendChild(selectOptionD);
        $.get("/departAll", function (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].departCode != 'departAll') {
                    let option = document.createElement("option");
                    option.setAttribute("value", data[i].departCode);
                    option.textContent = data[i].departName;
                    departSelect.appendChild(option);
                }
            }
            tag(".departC").append(departSelect);
            $(".departCode option:eq(0)").prop("selected", true); //첫번째 option 선택

            let teamSelect = document.createElement("select");
            teamSelect.setAttribute("class", "teamCode");
            teamSelect.setAttribute("name", "teamCode");

            let teamOption = document.createElement("option");
            teamOption.setAttribute("value", "teamAll");
            teamOption.innerHTML = "&emsp;&emsp;&emsp;";
            teamSelect.appendChild(teamOption);

            tag(".teamC").appendChild(teamSelect);
        })

    } else {
        let departSelect = document.createElement("select");
        departSelect.setAttribute("class", "departCode");
        departSelect.setAttribute("name", "departCode");
        departSelect.addEventListener("change", departTeam);
        departSelect.addEventListener("change", dirNum);
        let selectOptionD = document.createElement("option");
        selectOptionD.setAttribute("value", "departAll");
        selectOptionD.textContent = "*부서를 선택하시요.";
        departSelect.appendChild(selectOptionD);

        let teamSelect = document.createElement("select");
        teamSelect.setAttribute("class", "teamCode");
        teamSelect.setAttribute("name", "teamCode");
        teamSelect.addEventListener("change", dirNum);
        let selectOptionT = document.createElement("option");
        selectOptionT.setAttribute("value", "teamAll");
        selectOptionT.textContent = "*팀을 선택하시요.";
        teamSelect.appendChild(selectOptionT);

        $.get("/departAll", function (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].departCode != 'departAll') {
                    let option = document.createElement("option");
                    option.setAttribute("value", data[i].departCode);
                    option.textContent = data[i].departName;
                    departSelect.appendChild(option);
                }
            }
            tag(".departC").appendChild(departSelect);
            $(".departCode option:eq(0)").prop("selected", true); //첫번째 option 선택

            $.get("/teamAll", "departCode=" + tag(".departCode").value, function (data) {
                for (let i = 0; i < data.length; i++) {
                    let option = document.createElement("option");
                    option.setAttribute("value", data[i].teamCode);
                    option.textContent = data[i].teamName;
                    teamSelect.appendChild(option);
                }
                tag(".teamC").appendChild(teamSelect);
            })
        })
    }
}


