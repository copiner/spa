var indexPage = App.createPage("index",{
  getDomObj : function(dom){
    this.attachDom(".btn-group","btnGroup",dom)
        .attachEvent("btnGroup","click",this.clickHandler, false);
  },
  clickHandler : function(ev){
    var target = ev.target;
    var action = target.dataset.action;
    switch (action) {
      case "register":
        app.render(registerPage);
        break;
      case "login":
        app.render(loginPage);
        break;
      default:

    }
  }
});

//初始化
app.render(indexPage);
