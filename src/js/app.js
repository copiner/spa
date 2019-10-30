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
  // render:function(page){
  //   console.log(page)
  //   if (this.currentPage == page) return false;
  //   if (this.currentPage) this.currentPage._dispose();
  //   this.currentPage = page;
  //
  //   var pageContainer = this.pageContainer =
  //       this.pageContainer || document.querySelector(".pageContainer");
  //       //console.log(this.pageContainer)
  //   page.render(function (html) {
  //       pageContainer.innerHTML = html;
  //       page._initialize(pageContainer);
  //   });
  // },
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


(function () {
    var moving = false;
    var obj = {};
    var tapEvent = document.createEvent("CustomEvent");
    tapEvent.initCustomEvent("tap", true, false, obj);

    var touchstart = function (ev) {
        ev.stopPropagation();
    };

    var touchend = function (isTarget) {
        return function (ev) {
            ev.stopPropagation();
            var target = ev.target;
            if (!moving) {
                ev.preventDefault();
                var touch = ev.changedTouches[0];
                obj.clientX = touch.clientX;
                obj.clientY = touch.clientY;
                target.dispatchEvent(tapEvent);
            }
            moving = false;
        }
    };

    var touchmove = function (ev) {
        ev.stopPropagation();
        moving = true;
    };

    var defualtSlideFn = function (ev) {
        var x = ev.detail.deltaX, y = ev.detail.deltaY;
        return x == 0 || Math.abs(y) / Math.abs(x) > 1;
    };

    var isScroll = undefined,
        startObj = {},
        moveObj = {},
        endObj = {},
        sTime = null;

    var slideStartEvent = document.createEvent("CustomEvent");
    slideStartEvent.initCustomEvent("slidestart", true, false, startObj);

    var slideMoveEvent = document.createEvent("CustomEvent");
    slideMoveEvent.initCustomEvent("slidemove", true, false, moveObj);

    var slideEndEvent = document.createEvent("CustomEvent");
    slideEndEvent.initCustomEvent("slideend", true, false, endObj);

    var slidestart = function (ev) {
        ev.stopPropagation();
        startObj.x = ev.touches[0].clientX;
        startObj.y = ev.touches[0].clientY;
        sTime = Date.now();
    };

    var slidemove = function (doSlideFn) {
        doSlideFn = doSlideFn || defualtSlideFn;
        return function (ev) {
            moving = true;
            var target = ev.target;
            var clientX = ev.changedTouches[0].clientX,
                clientY = ev.changedTouches[0].clientY,
                deltaX = clientX - startObj.x,
                deltaY = clientY - startObj.y;

            if (isScroll === undefined) {
                if (doSlideFn.call(this, {detail: { deltaX: deltaX, deltaY: deltaY, clientX: clientX, clientY: clientY, target: target }})) {
                    isScroll = true;
                }
                else {
                    isScroll = false;
                    target.dispatchEvent(slideStartEvent);
                    ev.preventDefault();
                    ev.stopPropagation();
                }
            }
            else if (isScroll === false) {
                ev.preventDefault();
                ev.stopPropagation();
                moveObj.deltaX = deltaX;
                moveObj.deltaY = deltaY;
                moveObj.clientX = clientX;
                moveObj.clientY = clientY;
                target.dispatchEvent(slideMoveEvent);
            }
        }
    }

    var slideend = function (ev) {
        if (isScroll === false) {
            var target = ev.target;
            ev.stopPropagation();
            moving = false;
            var clientX = ev.changedTouches[0].clientX,
                clientY = ev.changedTouches[0].clientY;

            endObj.deltaX = clientX - startObj.x;
            endObj.deltaY = clientY - startObj.y;
            endObj.clientX = clientX;
            endObj.clientY = clientY;
            endObj.elapsed = Date.now() - sTime;
            target.dispatchEvent(slideEndEvent);
        }
        isScroll = undefined;
    };

    Page.prototype.attachSlide = function (key, startFn,  fn, endFn, propation, slideFn) {
        this.attachEvent(key, "touchstart", slidestart, propation);
        this.attachEvent(key, "touchmove", slidemove(slideFn), propation);
        this.attachEvent(key, "touchend", slideend, propation);
        this.attachEvent(key, "slidestart", startFn, propation);
        this.attachEvent(key, "slidemove", fn, propation);
        this.attachEvent(key, "slideend", endFn, propation);
        return this;
    }

    Page.prototype.attachTap = function (key, fn, propation, isTarget) {
        this.attachEvent(key, "touchstart", touchstart, propation);
        this.attachEvent(key, "touchmove", touchmove, propation);
        this.attachEvent(key, "touchend", touchend(isTarget), propation);
        this.attachEvent(key, "tap", fn, propation);
        return this;
    }
})();
