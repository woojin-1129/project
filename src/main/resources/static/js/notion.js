function delCheck(box) {
	let p = box.parentNode;
	if (box.checked) {
		p.style.textDecoration = "line-through";
		p.style.color = "#f00";
	} else {
		p.style.textDecoration = "none";
		p.style.color = "";
	}
}

$(".btnCancel").on("click", function () {
	$(".viewer").load("/notionListR");
});
$(".btnList").on("click", function () {
	$(".viewer").load("/notionListR");
});
$(".btnCreate").on("click", function () {

	$(".viewer").load("/notionCreate");
});
$(".btnSearch").on("click", function () {
	//검색 버튼이 클릭되면 표시될 페이지는 무조건 1페이지부터 이여야함
	move(1);
});

function move(nowPage) {
	let frm = document.frmNotionList;
	frm.nowPage.value = nowPage;
	let param = $(frm).serialize();
	$(".viewer").load("/notionListR", param);
}

function notionView(sno) {
	let frm = document.frmNotionList;
	let param = $(frm).serialize();
	param += "&sno=" + sno;
	let notionSno = "sno=" + sno;

	$(".viewer").load("/notionView", param, function () {
		$(".resultRepl").load("/notionRepl", notionSno);
	});
}

$(".btnCreateR").on("click", function () {
	const temp = document.frmNotionCreate;
	temp.enctype = "multipart/form-data";
	const frm = new FormData(temp);
	$.ajax({
		type: "POST",
		url: "/notionCreateR",
		contentType: false,
		processData: false,
		data: frm,
		success: function (msg) {
			if (msg != "") {
				alert(msg);
				return;
			}
			$(".btnCancel").click();
		},
	});
});

$(".btnDelete").on("click", function () {
	let frm = document.frmNotionView;
	let param = $(frm).serialize();
	$.get("/notionDeleteR", param, function (msg) {
		if (msg != "") {
			alert(msg);
		}
		$(".viewer").load("/notionListR", param);
	});
});

$(".btnModify").on("click", function () {
	let param = $(".frmNotionView").serialize();

	$(".viewer").load("/notionModify", param);
});

$(".btnModifyR").on("click", function () {
	let temp = document.frmNotionModify;
	temp.enctype = "multipart/form-data";
	let frm = new FormData(temp);
	$.ajax({
		type: "POST",
		url: "/notionModifyR",
		contentType: false,
		processData: false,
		data: frm,
		success: function (msg) {
			if (msg != "") {
				alert(msg);
				return
			}
			$(".btnList").click();
		},
	});
});

var isSubmitting = false;
$(".btnReplSummit").on("click", function () {
	if (isSubmitting) {
		return;
	}

	let temp = document.frmNotionView;
	if (temp.doc.value == "") {
		return;
	}
	let sno = temp.sno.value;
	let param = "sno=" + sno + "&doc=" + temp.doc.value

	isSubmitting = true;

	// 버튼 비활성화
	$(".btnReplSummit").prop("disabled", true);

	$.post("/notionReplR", param, function (msg) {
		if (msg != "") {
			alert(msg)
			return
		};
		temp.doc.value = "";
		$(".resultRepl").load("/notionRepl", "sno=" + sno);
	}).always(function () {
		// 요청 완료 후 중복 요청 플래그 해제 및 버튼 활성화
		isSubmitting = false;
		$(".btnReplSummit").prop("disabled", false);
	});
});

function replDelete(form) {
	let frm = document.frmNotionView;
	let vSno = frm.sno.value;
	let sno = form.sno.value
	$.ajax({
		type: "POST",
		url: "/notionReplDelete",
		data: { sno: sno },
		dataType: "text",
		success: function (msg) {
			if (msg != "") {
				alert(msg);
				return
			}
			$(".resultRepl").load("/notionRepl", "sno=" + vSno);
		},
	});
}

function replModify(form) {
	let doc = form.querySelector("#doc");
	if (doc.tagName == "DIV") {
		let docValue = doc.innerText;
		// Create a new input element
		let inputElement = document.createElement("input");

		// Set attributes for the input element
		inputElement.id = "doc";
		inputElement.name = "doc";
		inputElement.type = "text"; // You can set other input types as needed
		inputElement.value = docValue;

		// Replace the span element with the input element
		doc.parentNode.replaceChild(inputElement, doc);
	} else if (doc.tagName == "INPUT") {
		let sno = document.querySelector(".notionSno").value;
		let vSno = form.sno.value;
		let vDoc = form.doc.value;
		$.ajax({
			type: "POST",
			url: "/notionReplModify",
			data: {
				sno: vSno,
				doc: vDoc,
			},
			dataType: "text",
			success: function (msg) {
				if (msg != "") {
					alert(msg);
					return
				}
				$(".resultRepl").load("/notionRepl", "sno=" + sno);
			},
		});
	}
}
