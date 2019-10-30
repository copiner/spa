var backDom = document.querySelector("[data-action='back']");
var form = document.querySelector(".login-form");

backDom.addEventListener("click",function(){
  location.href = "index.html";
},false)

form.addEventListener("submit",function(ev){
  ev.preventDefault();
  var name = form.name.value;
  var password = form.password.value;
  location.href = "goal.html";
}, false)
