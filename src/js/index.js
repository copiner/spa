var indexPage = new Page("index");
console.log(indexPage)
indexPage.getDomObj = function(){
  this.btnGroup = this.domElement.querySelector(".btn-group");
  //console.log(this.domElement.querySelector(".btn-group"))
  this.btnGroup.addEventListener("click",this.clickHandler, false);
};

indexPage.removeDomObj = function(){
  this.btnGroup.removeEventListener("click",this.clickHandler,false);
  this.btnGroup = null;
};

indexPage.clickHandler = function(ev){
  var target = ev.target;
  var action = target.dataset.action;
  switch (action) {
    case "register":
      indexPage.unit();
      registerPage.init(pageContainer);
      break;
    case "login":
      indexPage.unit();
      loginPage.init(pageContainer);
      break;
    default:

  }
}
var pageContainer = document.querySelector(".pageContainer");
indexPage.init(pageContainer);
