var indexPage = App.createPage("index","index",{
  render: function (fn) {
      this.fetch("../html/index.html", function (text) {
          fn(text);
      });
  },
  getDomObj : function(dom){
    this.attachDom(".btn-group","btnGroup",dom)
        .attachDom(".index-container", "container", dom)
        .attachSlide("container", this.startFn, this.moveFn, this.endFn)
        .attachTap("btnGroup", this.tapHandler, false);
  },
  tapHandler : function(ev){
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
  },
  startFn: function (ev) {},
  moveFn: function (ev) {},
  endFn: function (ev) {
      var speed = 1000 * ev.deltaX / ev.elapsed;
      if (speed > 200) {
          app.render(registerPage);
      } else if (speed < -200) {
          app.render(loginPage);
      }
  }
});

//初始化
var app = new App();
app.initialize(null, indexPage);
