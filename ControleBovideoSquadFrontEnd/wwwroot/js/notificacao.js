$(document).bind("ajaxStart", function(){
    $(".loader-wrapper").fadeIn("fast")
})
$(document).bind("ajaxComplete", function(){
    $(".loader-wrapper").fadeOut("fast")
})

function MostrarToast(msg){    
    var msgError = document.getElementById('toastMsg')
    msgError.innerHTML = msg;          
    $("#toastNotificacao").toast('show');
}

function MostrarErro(msg){
    $("#toastNotificacao").removeClass('bg-success')
    $("#toastNotificacao").addClass('bg-danger')
    MostrarToast(msg); 
}

function MostrarSucesso(msg){
    $("#toastNotificacao").addClass('bg-success')
    $("#toastNotificacao").removeClass('bg-danger')
    MostrarToast(msg);   
}

function MostrarMensagem(msg){
    const toast = document.getElementById("toast")
    toast.innerHTML = msg
    toast.style.opacity = 1
    setTimeout(() => toast.style.opacity = 0, 2000)
}