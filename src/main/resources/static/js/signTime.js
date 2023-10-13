$(document).ready(function () {
    let form = document.frm
    if (tag(".initiativeDate")) {
        form.initiativeDate.valueAsDate = new Date()
        form.PaymentDate.valueAsDate = new Date()
        form.expenditure.valueAsDate = new Date()
    }
    if (tag(".startDate")) {
        form.startDate.valueAsDate = new Date()
        form.endDate.valueAsDate = new Date()
    }
})