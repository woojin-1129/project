/* 조직도(OC) 검색기능 */
//검색창 엔터키 기능
$('.findStr').on('keydown', function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        search();
    }
})
$('.btnFind').on('click', search)

function search() {
    let findStr = document.querySelector('.findStr').value;

    $(".viewer").load("/search", "findStr=" + findStr);
}

tag(".ocViewer").addEventListener("scroll", function () {
    if (tag(".modal")) {
        tag(".modal").remove();
        currentModal = null;
    }
})

/* 조직도(OC) Modal 정보창 */
// 변수가 없는 경우에만 선언.
if (!window.currentModal) {
    // 전역 변수로 현재 열려 있는 모달을 저장하는 변수
    let currentModal = null;


    // 직원 정보를 모달 창에 표시하는 함수
    function openModal(employeeData, clickX, clickY) {

        // 이미 모달이 열려 있다면 닫기
        if (currentModal) {
            currentModal.remove();
        }

        // 모달 내용 생성
        let modalContent = `
                <div class="employee-popup">
                    <div class="employee-details">
                        <span class="closeInfo"> 탭을 클릭시 정보 탭이 종료됩니다.</span>
                        <hr/>
                        <span class="partInfo">소속 : </span>
                        <span class="departName">${employeeData.departName}</span>
                        <span class="teamName">${employeeData.teamName}</span>
                        <br/>
                        <span class="tierInfo">직급 : </span>
                        <span class="tierName">${employeeData.tierName}</span>
                        <br/>
                        <span class="nameInfo">성명 : </span>
                        <span class="name">${employeeData.name}</span>
                        <br/>
                        <span class="enInfo">사번 : </span>
                        <span class="employeeNumber">${employeeData.employeeNumber}</span>
                        <br/>
                        <span class="jcInfo">입사일 : </span>
                        <span class="joinCompany">${employeeData.joinCompany}</span>
                        <br/>
                        <span class="emailInfo">E-mail : </span>
                        <span class="email">${employeeData.email}</span>
                        <br/>
                        <span class="telInfo">사내전화번호 : </span>
                        <span class="tel">${employeeData.tel}</span>
                    </div>
                </div>
            `;

        // 모달 엘리먼트 생성 및 스타일 설정
        const modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML = modalContent;
        modal.style.left = clickX + "px";
        modal.style.top = clickY + "px";

        // 모달을 body에 추가
        document.body.appendChild(modal);
        currentModal = modal; // 현재 모달을 저장

        // 모달 클릭 이벤트
        modal.onclick = function () {
            modal.remove();
            currentModal = null; // 모달이 닫히면 currentModal을 null로 설정
        };
    }

    // .result 클래스를 가진 요소들을 선택하여 각각에 클릭 이벤트를 추가.
    $('.result').on('click', function (event) {
        event.stopPropagation(); // 이벤트 전파 중단하여 모달이 열릴 때 다른 요소로의 이벤트 전파를 막음.
        // 클릭한 요소에 포함된 정보를 가져와서 employeeData 객체에 저장.
        let employeeData = {
            departName: $(this).find('.departName').text(),
            teamName: $(this).find('.teamName').text(),
            tierName: $(this).find('.tierName').text(),
            name: $(this).find('.name').text(),
            employeeNumber: $(this).find('.employeeNumber').text(),
            joinCompany: $(this).find('.joinCompany').text(),
            email: $(this).find('.email').text(),
            tel: $(this).find('.tel').text(),
        };

        // 클릭한 위치의 X, Y 좌표를 가져와서 openModal 함수에 전달.
        let clickX = event.clientX;
        let clickY = event.clientY;

        // openModal 함수를 호출하여 모달을 열고 직원 정보를 표시.
        openModal(employeeData, clickX, clickY);
    });

    // .findResult 클래스를 가진 요소들을 선택하여 각각에 클릭 이벤트를 추가.
    $('.partition').on('click', '.findResult', function (event) {
        event.stopPropagation(); // 이벤트 전파 중단하여 모달이 열릴 때 다른 요소로의 이벤트 전파를 막음.
    
        // 클릭한 요소에 포함된 정보를 가져와서 employeeData 객체에 저장.
        let employeeData = {
            departName: $(this).find('.departName').text(),
            teamName: $(this).find('.teamName').text(),
            tierName: $(this).find('.tierName').text(),
            name: $(this).find('.name').text(),
            employeeNumber: $(this).find('.employeeNumber').text(),
            joinCompany: $(this).find('.joinCompany').text(),
            email: $(this).find('.email').text(),
            tel: $(this).find('.tel').text(),
        };
    
        // 클릭한 위치의 X, Y 좌표를 가져와서 openModal 함수에 전달.
        let clickX = event.clientX;
        let clickY = event.clientY;
    
        // openModal 함수를 호출하여 모달을 열고 직원 정보를 표시.
        openModal(employeeData, clickX, clickY);
    });
    
}

