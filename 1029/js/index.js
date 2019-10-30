var indexPage = App.createPage("index",{
  render: function (fn) {
      this.fetch("../html/index.html", function (text) {
          fn(text);
      });
  },
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
var app = new App();
app.render(indexPage);
