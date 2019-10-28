function App(){
  this.currentPage = null;
  this.pageContainer= null;
  this.staticPage = null;
  this.routeObj = {};
}

App.prototype = {
  render:function(page){

    if(this.currentPage == page) return false;
    var pageContainer = this.pageContainer =
        this.pageContainer || document.querySelector(".root");

    if(this.currentPage) this.currentPage._dispose();

    this.currentPage = page;
    this.currentPage._initialize(pageContainer);
  },
  initialize:function(staticPage, indexPage){

    staticPage = this.staticPage = staticPage || App.emptyPage;
    var that = this;

    staticPage.render(function(html){
      var body = document.body;
      body.insertAdjacentHTML("afterbegin",html);
      staticPage._initialize(body);

      if(staticPage.domList.pageContainer){
        that.pageContainer = staticPage.domList.pageContainer;
      } else {
        console.log("staticPage must have pageContainer");
      }

      that.render(indexPage, true);

      window.addEventListener("popstate",function(ev){
        if(ev.state && ev.state.date){
          var url = ev.state.data;
          var page = that.routeObj[url];
          that._renderPage(page);
        }
      },false)
    })
  },
  _attachHistory: function(page, isBack){
    var newUrl = page.url;
    if(isBack){
      history.replaceState({date:newUrl},"",newUrl);
    } else {
      history.pushState({data:newUrl},"",newUrl);
    }
  },
  _renderPage : function(page){
    if(this.currentPage) this.currentPage._dispose();
    this.currentPage = page;
    page.app = this;

    document.title = page.title;
    var pageContainer = this.pageContainer;
    page.render(function(html){
      pageContainer.innerHTML = html;
      page._initialize(pageContainer);
    })
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

App.createPage = function(title, url, options){
  var page = new Page(title, url);
  App.extend(page, options);
  return page;
}

App.emptyPage = App.createPage("","",{
  render:function(fn){
    fn("<div class='pageContainer'></div>")
  },
  getDomObj:function(dom){
    this.attachDom(".pageContainer","pageContainer",dom);
  }
})

var app = new App();
