var loginPage = App.createPage("login",{
  render: function (fn) {
      this.fetch("../html/login.html", function (text) {
          fn(text);
      });
  },
  getDomObj : function(dom){
    this.attachDom("[data-action='back']","backBtn",dom)
        .attachDom(".login-form","form",dom)
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
    app.render(goalPage);
  }
});
