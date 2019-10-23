var loginPage = new Page("login");
loginPage.getDomObj = function(){
  this.backDom = this.domElement.querySelector("[data-action='back']");
  this.form = this.domElement.querySelector(".login-form");
  this.backDom.addEventListener("click",this.clickBackDomHander,false);
  this.form.addEventListener("submit",this.formSubmitHandler, false);
};

loginPage.removeDomObj = function(){
  this.backDom.removeEventListener("click",this.clickBackDomHander,false);
  this.backDom.removeEventListener("submit",this.formSubmitHandler,false);
  this.backDom = null;
  this.form = null;
};

loginPage.formSubmitHandler = function(ev){
  ev.preventDefault();
  var form = ev.target;
  var name = form.name.value;
  var password = form.password.value;
  loginPage.unit();
  goalPage.init(rootDiv);
}

loginPage.clickBackDomHander = function(ev){
  loginPage.unit();
  indexPage.init(rootDiv);
}
