var indexPage = new Page("index");
//console.log(indexPage)
indexPage.getDomObj = function(){
  this.btnGroup = this.domElement.querySelector(".btn-group");
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
      registerPage.init(rootDiv);
      break;
    case "login":
      indexPage.unit();
      loginPage.init(rootDiv);
      break;
    default:

  }
}
var rootDiv = document.querySelector(".root");
indexPage.init(rootDiv);
