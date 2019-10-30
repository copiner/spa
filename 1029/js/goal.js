var goalPage = App.createPage("goal",{
  render: function (fn) {
      this.fetch("../html/goal.html", function (text) {
          fn(text);
      });
  },
  getDomObj : function(){}
});
