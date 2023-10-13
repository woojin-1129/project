document.querySelector(".pwd").addEventListener("keydown", key)

function key(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        login()
    }
}

// 로그인 구현
$("#login-btnLogin").on("click", login)
$(".id").keyup(cookie)

function login() {
    let cookieParam = "id=" + document.querySelector(".id").value
    if ($("#flexCheckDefault").is(":checked")) {
        $.post("/loginCookieSet", cookieParam)
    } else {
        $.post("/loginCookieDelete")
    }

    let form = document.form
    let param = "id=" + form.id.value + "&pwd=" + form.pwd.value
    $.get("/loginCheck", param, function (msg) {
        if (msg != "") {
            alert(msg);
        } else {
            location.href = "/";
        }
    })
}

function cookie () {
    let param = "id=" + document.querySelector(".id").value
    if($("#flexCheckDefault").is(":checked")) {
        $.post("/loginCookieSet", param)
    } else {
        $.post("/loginCookieDelete")
    }
}

$(document).ready(function () {
    $.get("/loginCookieGet", function (id) {
        $(".id").val(id)
    })
})
