var Busi = {
  phoneReg:/^1(3|4|5|7|8)\d{9}$/,
  certNoReg:/^[1-9]\d{5}(18|19|2([0-9]))\d{2}(0[0-9]|10|11|12)([0-2][1-9]|10|20|30|31)\d{3}[0-9Xx]$/,

  /**
  前置校验，比如说报表查询条件等等 prop输入框自定义属性data-in
  @param var prop = $("id").attr("data-in");
  @param var v = $("id").val();
  @return boolean

  for(let i=0;i<arr.length;i++){
    if(!Busi.PreQuery(arr[1].prop, arr[i].value)){
      break;
    }
  }
  */

  PreQuery:function(prop,v){
    switch (prop) {
      case prop == 'IDNO':
        if(certNoReg.test(v)){
          return true
        } else {
          return false;
        };
        break;
      case prop == 'PHONE':
        if(phoneReg.test(v)){
          return true
        } else {
          return false;
        };
        break;
      default:

    }
  }

  
}
