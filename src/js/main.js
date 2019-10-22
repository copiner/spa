function Page(id){
  this.html = document.getElementById(id).textContent;
  this.document = null;
}

Page.prototype = {
  render: function(dom){
    this.domElement = dom;
    console.log(dom)
    this.domElement.innerHTML = this.html;
    //dom.innerHTML = this.html;
  },
  getDomObj:function(){//实例中手动重写
    console.error("must be override");
  },
  removeDomObj:function(){//实例中手动重写
    console.error("must be override");
  },
  init:function(dom){
    this.render(dom);
    this.getDomObj();
  },
  unit:function(){
    this.removeDomObj();
  }
};
