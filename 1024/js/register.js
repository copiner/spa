var registerPage = App.createPage("register",{
  getDomObj : function(dom){
    this.attachDom("[data-action='back']","backBtn",dom)
        .attachDom(".register-form","form",dom)
        .attachEvent("backBtn","click",this.clickBackHander,false)
        .attachEvent("form","submit",this.formSubmitHandler, false);
  },
  clickBackHander : function(ev){
    app.render(indexPage);
  },
  formSubmitHandler : function(ev){
    ev.preventDefault();
    var form = ev.target;
    var name = form.name.value;
    var password = form.password.value;
    var agree = form.agree.checked;
    if(agree){
      app.render(goalPage);
    }
  }
});
