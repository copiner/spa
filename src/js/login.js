var loginPage = App.createPage("login","login",{
  render: function (fn) {
      this.fetch("../html/login.html", function (text) {
          fn(text);
      });
  },
  getDomObj : function(dom){
    this.attachDom("[data-action='back']","backBtn",dom)
        .attachDom(".login-form", "form", dom)
        .attachDom(".login-container", "container", dom)
        .attachSlide("container", this.startFn, this.moveFn, this.endFn)
        .attachTap("backBtn", this.tapBackHandler, false)
        .attachEvent("form", "submit", this.formSubmitHandler, false);
  },
  tapBackHandler : function(ev){
    app.render(indexPage);
  },
  formSubmitHandler : function(ev){
    ev.preventDefault();
    var form = ev.target;
    var name = form.name.value;
    var password = form.password.value;
    app.render(goalPage);
  },
  startFn: function (ev) {},
  moveFn: function (ev) {},
  endFn: function (ev) {
      var speed = 1000 * ev.deltaX / ev.elapsed;
      if (speed > 200) {
          app.render(indexPage);
      }
  }
});
