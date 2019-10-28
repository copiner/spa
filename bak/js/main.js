function Page(id){
  this.html = document.getElementById(id).textContent;
  this.domList = {};
  this.eventList = [];
}

Page.prototype = {
  render: function(dom){
    this.domElement = dom;
    this.domElement.innerHTML = this.html;
    //dom.innerHTML = this.html;
  },
  getDomObj:function(){
    console.error("must be override");
  },
  removeDomObj:function(){//实例中手动重写
    console.error("must be override");
  },
  _dispose:function(){
    this._removeEventListeners();
    this._removeDom();
  },
  _initialize:function(container){
    container.innerHTML = this.html;
    this.getDomObj(container);
    this._addEventListeners();
    console.log("init");
  },
  attachDom: function(cssQuery, key, dom){
    dom = dom || document;
    this.domList[key] = dom.querySelector(cssQuery);
    console.log(this.domList)
    return this;
  },
  attachEvent:function(key,eventStr,fn,propation,doFn){
    propation = propation || false;
    var eventList = this.eventList;
    doFn = doFn || fn.bind(this);
    var eventObj = this._getEvent(eventList,{key:key});
    if(eventObj){
      var eventArray = eventObj.eventArray;
      var methodEventObj = this._getEvent(eventArray,{method:eventStr});
      if(methodEventObj){
        var fnArray = methodEventObj.fnArray;
        var obj = this._getEvent(fnArray,{backFn:fn, propation:propation});
        if(!obj){
          fnArray.push({
            backFn:fn,
            propation:propation,
            doFn:doFn
          });
        }
      } else {
        eventArray.push({
          method:eventStr,
          fnArray:[{
            backFn:fn,
            propation:propation,
            doFn:doFn
          }]
        })
      }
    } else {
      eventList.push({
        key:key,
        eventArray:[{
          method:eventStr,
          fnArray:[{
            backFn:fn,
            propation:propation,
            doFn:doFn
          }]
        }]
      })
    }
    return this;
  },
  _getEvent:function(list,obj){
    for(var i = 0, len = list.length; i< len; i++){
      var item = list[i];
      var value = true;
      for(var k in obj){
        var tempValue = (item[k] === obj[k]);
        value = value && tempValue;
      }
      if(value) return list[i];
    }
    return false;
  },
  _removeDom:function(){
    var domList = this.domList;
    for(var key in domList){
      domList[key] = null;
    }
  },
  _addEventListeners:function(){
    var domList = this.domList, eventList = this.eventList;
    console.log(eventList);
    for(var i = 0, len = eventList.length; i < len; i++){
      var eventObj = eventList[i];
      var dom = domList[eventObj.key];
      var eventArray = eventObj.eventArray;
      console.log(eventArray);
      for(var j = 0, length = eventArray.length; j < length; j++){
         var methodEventObj = eventArray[j];
         var key = methodEventObj.method;
         var fnArray = methodEventObj.fnArray;
         console.log(fnArray)
         for(var ii = 0; ii<fnArray.length; ii++){
           dom.addEventListener(key, fnArray[ii].doFn, fnArray[ii].propation);
         }
      }
    }
  },
  _removeEventListeners:function(){
    var domList = this.domList, eventList = this.eventList;
    for(var i = 0, len = eventList.length; i<len; i++){
      var eventObj = eventList[i];
      var dom = domList[eventObj.key];
      var eventArray = eventObj.eventArray;
      for(var j = 0, length = eventArray.length; j<length;j++){
        var methodEventObj = eventArray[j];
        var key = methodEventObj.method;
        var fnArray = methodEventObj.fnArray;
        for(var ii = 0; ii < fnArray.length; ii++){
          dom.removeEventListener(key, fnArray[ii].doFn, fnArray[ii].propation);
        }
      }
    }
    this.eventList.length = 0;
  },
  init:function(dom){
    this.render(dom);
    this.getDomObj();
  },
  unit:function(){
    this.removeDomObj();
  }
};
