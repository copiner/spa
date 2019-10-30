var btnGroup = document.querySelector(".btn-group");
btnGroup.addEventListener("click",function(ev){
  var target = ev.target;
  var action = target.dataset.action;
  switch(action){
    case "register":
        location.href = "register.html";
        break;
    case "login":
        location.href = "login.html";
        break;
  }
}, false)
