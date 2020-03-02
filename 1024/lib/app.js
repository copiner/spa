function App(){
  this.currentPage = null;
  this.pageContainer= null;
}

App.prototype = {
  render:function(page){
    if(this.currentPage == page) return false;
    var pageContainer = this.pageContainer =
        this.pageContainer || document.querySelector(".root");

    if(this.currentPage) this.currentPage._dispose();

    this.currentPage = page;
    this.currentPage._initialize(pageContainer);
  }
}

App.extend = function(obj, options){
  console.log(options);
  options = options || {};
  for (var key in options){//Object.keys(arr)
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

App.createPage = function(id, options){
  var page = new Page(id);
  App.extend(page, options);
  return page;
}
