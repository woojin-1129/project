// 처음 이전 1 2 3 4 다음 맨끝 에서 사용
function move(nowPage) {
    tag(".nowPage").value = nowPage;
    let param = "nowPage=" + nowPage
    $(".viewer").load("/workCommute", param);
}