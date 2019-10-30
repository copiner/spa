var registerPage = App.createPage("register","register",{
  render: function (fn) {
      this.fetch("../html/register.html", function (text) {
          fn(text);
      });
  },
  getDomObj : function(dom){
    this.attachDom("[data-action='back']","backBtn",dom)
        .attachDom(".register-form","form",dom)
        .attachDom(".register-container", "container", dom)
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
    var agree = form.agree.checked;
    if(agree){
      app.render(goalPage);
    }
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
