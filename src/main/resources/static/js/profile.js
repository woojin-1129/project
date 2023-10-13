if (tag(".btnPost")) {
    tag(".btnPost").addEventListener("click", post)
    tag(".btnProfileModifyR").addEventListener("click" , employModifyR)
    tag(".btnHome").addEventListener("click" , home)
}

function post() {
    let frm = document.frmEmployModify
    new daum.Postcode({
        oncomplete: function(data) {
            frm.zipcode.value = data.zonecode
            frm.address1.value = data.address
    }
    }).open();
}

function employModifyR() {
    let frm = document.frmEmployModify
    $.ajax({
        type: "POST",
        url: "/profileModifyR",
        data: {
            "sno" : frm.sno.value,
            "tel" : frm.tel.value,
            "id": frm.id.value,
            "pwd": frm.pwd.value,
            "name": frm.name.value,
            "birthday": frm.birthday.value,
            "phone": frm.phone.value,
            "email": frm.email.value,
            "zipcode": frm.zipcode.value,
            "address1": frm.address1.value,
            "address2": frm.address2.value
        },
        datatype : "text",
        success: function (msg) {
            if (msg != "") {
                alert(msg)
                return;
            }
            $(".btnHome").click();
        }
    })
}
