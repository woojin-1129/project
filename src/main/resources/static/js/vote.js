$(".btnPlus").on("click", function () {
  const selectionContainer = document.querySelector(".selectionContainner");
  const selectionInput = document.createElement("input");
  selectionInput.type = "text";
  selectionInput.name = "selectDoc";
  selectionInput.className = "selectDoc";
  selectionInput.placeholder = `${
    selectionContainer.children.length + 1
  }. 선택지 내용을 입력해주세요...`;
  selectionContainer.appendChild(selectionInput);
});

$(".btnMinus").on("click", function () {
  const selectionContainer = document.querySelector(".selectionContainner");
  const lastSelection = selectionContainer.lastElementChild;
  if (lastSelection) {
    selectionContainer.removeChild(lastSelection);
  }
});

function resultContainner(sno) {
  $(".viewer").load("/selectView", "sno=" + sno);
}

$(".btnVoteList").on("click", function () {
  $(".viewer").load("/voteList");
});

$(".btnCreateVote").on("click", function () {
  $(".viewer").load("/voteCreate");
});

$(".btnVoteSubmmit").on("click", function () {
  const temp = document.frmVoteCreate;
  const frm = new FormData(temp);
  $.ajax({
    type: "POST",
    url: "/voteCreateR",
    contentType: false,
    processData: false,
    data: frm,
    success: function (msg) {
      if (msg == "저장 중 오류 발생") {
        alert(msg);
        return;
      }
      $(".viewer").load("/voteView", "sno=" + msg);
    },
  });
});

$(".btnVoteResult").on("click", function () {
  const temp = document.frmVoteView;
  const frm = new FormData(temp);
  if (temp.selectDoc.value == "") {
    alert("투표를 진행해주세요");
    return
  }
  $.ajax({
    type: "POST",
    url: "/voteResult",
    contentType: false,
    processData: false,
    data: frm,
    success: function (msg) {
      if (msg == "저장 중 오류 발생") {
        alert(msg);
        return;
      }
      $(".viewer").load("/voteResultView", "sno=" + msg);
    },
  });
});

$(".btnVoteDelete").on("click", function () {
  let temp = document.frmVoteView;
  $.ajax({
    type: "POST",
    url: "/voteDelete",
    data: { sno: temp.sno.value },
    dataType: "text",
    success: function (msg) {
      if (msg == "저장 중 오류 발생") {
        alert(msg);
        return;
      }
      $(".viewer").load("/voteList");
    },
  });
});

$(".btnVoteDeleteR").on("click", function () {
  let temp = document.frmVoteResult;
  $.ajax({
    type: "POST",
    url: "/voteDelete",
    data: { sno: temp.sno.value },
    dataType: "text",
    success: function (msg) {
      if (msg == "저장 중 오류 발생") {
        alert(msg);
        return;
      }
      $(".viewer").load("/voteList");
    },
  });
});

$(".btnCancel").on("click", function () {
  $(".votingBoard").click()
})