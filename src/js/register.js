var registerPage = new Page("register");
registerPage.getDomObj = function(){
  this.backDom = this.domElement.querySelector("[data-action='back']");
  this.form = this.domElement.querySelector(".register-form");
  this.backDom.addEventListener("click",this.clickBackDomHander,false);
  this.form.addEventListener("submit",this.formSubmitHandler, false);
};

registerPage.removeDomObj = function(){
  this.backDom.removeEventListener("click",this.clickBackDomHander,false);
  this.backDom.removeEventListener("submit",this.formSubmitHandler,false);
  this.backDom = null;
  this.form = null;
};

registerPage.formSubmitHandler = function(ev){
  ev.preventDefault();
  var form = ev.target;
  var name = form.name.value;
  var password = form.password.value;
  var agree = form.agree.checked;
  if(agree){
    registerPage.unit();
    goalPage.init(pageContainer);
  }

}

registerPage.clickBackDomHander = function(ev){
  loginPage.unit();
  indexPage.init(pageContainer);
}
