function App(options){
  options = options || {};
  App.extend(options, {
     appClass: "app",
     changeClass: "app-change",
     backClass: "app-back",
     changeState: "change-state",
     pageInReverse: "page-in-reverse",
     pageOutReverse: "page-out-reverse",
     pageIn: "page-in",
     pageOut: "page-out"
  });
  this.options = options;
  this.currentPage = null;
  this.staticPage = null;
  this.pageContainer = null;
  this.backDom = null;
  this.changeDom = null;
  this.routeObj = {};
  this.history = new History();
}

App.prototype = {
  render:function(page){
    // console.log(page)
    // if (this.currentPage == page) return false;
    // if (this.currentPage) this.currentPage._dispose();
    // this.currentPage = page;
    //
    // var pageContainer = this.pageContainer =
    //     this.pageContainer || document.querySelector(".pageContainer");
    //     //console.log(this.pageContainer)
    // page.render(function (html) {
    //     pageContainer.innerHTML = html;
    //     page._initialize(pageContainer);
    // });
  },
  initialize: function (staticPage, indexPage) {
      staticPage = this.staticPage = staticPage || App.emptyPage;
      var that = this;
      console.log(staticPage);
      staticPage.render(function (html) {
          var body = document.body;
          body.insertAdjacentHTML("afterbegin", html);
          staticPage._initialize(body);
          if (staticPage.domList.pageContainer) {
              that.pageContainer = staticPage.domList.pageContainer;
          } else {
              console.error("staticPage must have pageContainer");
          }
          that._createOptionDom();
          that.render(indexPage, true);

          window.addEventListener("popstate", function (ev) {
            if (ev.state && ev.state.data) {
                var url = ev.state.data;
                var page = that.routeObj[url];
                var urlObj = that.history.getSurround();
                if (urlObj.prev == url) {
                    that.history.back();
                    that.isRenderBack = true;
                }
                else if (urlObj.next === url) {
                    that.history.forward();
                    that.isRenderBack = false;
                }

                that._renderPage(page);
            }
        }, false);
      });
  },
  _createOptionDom: function () {
      var options = this.options;
      this.changeDom = document.createElement("div");
      this.changeDom.className = options.changeClass;
      this.backDom = document.createElement("div");
      this.backDom.className = "";
      this.pageContainer.appendChild(this.changeDom);
      this.pageContainer.appendChild(this.backDom);
  },
  _replaceDom: function () {
      var options = this.options;
      var that = this;
      this.backDom.className = options.backClass;
      var tempDom = this.backDom;
      this.backDom = this.changeDom;
      this.changeDom = tempDom;
      this.pageContainer.classList.add(options.changeState);

      if (this.isRenderBack) {
          this.backDom.dataset.action = options.pageInReverse;
          this.changeDom.dataset.action = options.pageOutReverse;
      }
      else {
          this.backDom.dataset.action = options.pageOut;
          this.changeDom.dataset.action = options.pageIn;
      }
      this.isRenderBack = false;

      var changeDom = this.changeDom;
      var changeHandler = function (ev) {
          changeDom.className = options.changeClass;
          changeDom.dataset.action = "";
          that.backDom.dataset.action = "";
          that.backDom.className = "";
          that.backDom.innerHTML = "";
          that.pageContainer.classList.remove("options.changeState");
          changeDom.removeEventListener("animationend", changeHandler, false);
          changeDom.removeEventListener("animationcancel", cancelHandler, false);
      }
      var cancelHandler = function (ev) {
          changeDom.removeEventListener("animationend", changeHandler, false);
          changeDom.removeEventListener("animationcancel", cancelHandler, false);
      }
      changeDom.addEventListener("animationend", changeHandler, false);
      changeDom.addEventListener("animationcancel", cancelHandler, false);
  },
  _attachHistory: function (page, isBack) {
      var newUrl =  page.url;

      if (isBack) {
          history.replaceState({data: newUrl}, "", newUrl);
          this.history.replaceState(newUrl);
      }
      else {
          history.pushState({data: newUrl}, "", newUrl);
          this.history.pushState(newUrl);
      }
  },
  renderBack: function (page, isBack) {
        this.isRenderBack = true;
        this._render(page, isBack);
    },
  render: function (page, isBack) {
        this._render(page, isBack);
    },
  renderInstance: function (page, isBack) {
        this._render(page, isBack, true);
    },
  _render: function (page, isBack, instance) {
    console.log(page)
        if (typeof page === "string") page = this.routeObj[page];
        if (page === this.currentPage) return;
        this.routeObj[page.url] = page;
        this._attachHistory(page, isBack);
        this._renderPage(page, instance);
        this.pageContainer.scrollTop = 0;
    },
  _renderPage: function (page, isInstance) {
        if (this.currentPage) this.currentPage._dispose();
        this.currentPage = page;
        page.app = this;
        var that = this;
        console.log(that)
        document.title = page.title;

        page.render(function (html) {
          console.log(html)
            if (isInstance) {
                var changeDom = that.changeDom;
                changeDom.innerHTML = html;
                page._initialize(changeDom);
            } else {
                var backDom = that.backDom;
                backDom.innerHTML = html;
                that._replaceDom();
                page._initialize(backDom);
            }
        });
    }
}

App.extend = function(obj, options){
  options = options || {};
  for (var key in options){
    var desptor = Object.getOwnPropertyDescriptor(options, key);
    if(desptor.value) {
      obj[key] = desptor.value
    } else {
      if(desptor.get && desptor.set){
        Object.defineProperty(obj, key, {get:desptor.get, set:desptor.set});

      } else if(desptor.get){
        Object.defineProperty(obj, key, {get:desptor.get});
      } else if(desptor.set){
        Object.defineProperty(obj, key, {set:desptor.set});
      }
    }
  }
  return obj;
}

App.createPage = function (title, url, options) {
    var page = new Page(title, url);
    App.extend(page, options);
    return page;
}

App.emptyPage = App.createPage("", "", {
    render: function (fn) {
        fn("<div class='pageContainer'></div>");
    },
    getDomObj: function (dom) {
        this.attachDom(".pageContainer", "pageContainer", dom);
    }
});
