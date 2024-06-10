function Findpair(divid,output,config){
  // 获取按钮元素  
  const refreshButton = document.querySelector('#refreshButton');  
    
  // 添加点击事件监听器  
  refreshButton.addEventListener('click', () => {  
      location.reload(); // 刷新页面  
  });

  var defaults = {
    hard: 1,  
  };
  //初始化
  if(config==null){
    config = new Object();
  }
  var fbox = new Object();
  fbox = (function(fbox){
    fbox.hard = config.hard ? config.hard : defaults.hard;
    fbox.fboxid = document.getElementById(divid);
    return fbox;
  })(fbox);

  //开始新游戏
  fbox.newgame = function()
  {
    var _this = this;
    var hard = 1;
    var fboxid = _this.fboxid;
    _this.success = 0;
    _this.step = 0;
    _this.times1 = 0;
    _this.times2 = 0;
    _this.timeflag = false;
    var row;
    var data1 = null; //存储第1个格子id
    var data2 = null; //存储第2个格子id
    // if(hard==1){
    //   row = 4;
    //   pairs = 4;
    // }else if(hard==2){
    //   row = 6;
    //   pairs = 9;
    // }else{
    //   row = 8;
    //   pairs = 10;
    // }
    row = 4;
    pairs = 4;
    fboxid.className = "fbox hard_"+hard;
    fboxid.innerHTML = '';

    let fid = 1;
    for(let i=0;i<row;i++){
      //创建div
      let ul = document.createElement("ul");
      let html = '';
      for(let y=0;y<row;y++){
        html += '<li data-fid="'+fid+'"><div><p></p></div></li>';
        fid++;
      }
      ul.innerHTML = html;
      fboxid.appendChild(ul);
    }

    //随机素材
    icons = new Array();
    for(i=0;i<pairs;i++){
      rander = randomNum(1,20,icons);
      icons.push(rander);
    }

    //分配随机数组
    total = row*row/2;
    averarr = average(total,pairs);

    //格子数列
    liarr = new Array();
    for(let i=1;i<=row*row;i++){
      liarr.push(i);
    }

    //配对格子
    rowarr = new Array();
    for(let i=0;i<icons.length;i++){
      for(let y=0;y<averarr[i];y++){
        //12,9,2 解释：第12格和第9格配对，素材id为2
        let a = arrforone(liarr);
        liarr = delarr(liarr,a);
        let b = arrforone(liarr);
        liarr = delarr(liarr,b);
        let c = a+','+b+','+icons[i];
        rowarr.push(c);
      }
    }
    //分配素材
    for(let i=0;i<rowarr.length;i++) {
      let sarr = rowarr[i].split(',');
      let td1 = fboxid.querySelector('[data-fid="'+sarr[0]+'"]').getElementsByTagName('p')[0];
      let td2 = fboxid.querySelector('[data-fid="'+sarr[1]+'"]').getElementsByTagName('p')[0];
      td1.style.backgroundImage = td2.style.backgroundImage = 'url("images/'+sarr[2]+'.png")';
    }

    //添加点击事件
    var tout;
    li = fboxid.getElementsByTagName('li');
    outputdiv = document.getElementById(output);
    for(let i=0;i<li.length;i++){
      li[i].addEventListener('click', function() {
        //第三次点击
        if(tout && tout!=null && tout!=""){
          clearTimeout(tout);
          fboxid.querySelector('[data-fid="'+data1+'"]').classList.remove('on');
          fboxid.querySelector('[data-fid="'+data2+'"]').classList.remove('on');
          data1 = data2 = null;
          tout = null;
        }
        //已打开的格子不能操作
        if(this.classList.contains('on')==true){
          return false;
        }
        this.classList.add('on');
        let lid = Number(li[i].dataset.fid);
        if(data1==null && data2==null){
          data1 = lid;
        }else{
          data2 = lid;
          bg1 = fboxid.querySelector('[data-fid="'+data1+'"]').getElementsByTagName('p')[0].style.backgroundImage;
          bg2 = fboxid.querySelector('[data-fid="'+data2+'"]').getElementsByTagName('p')[0].style.backgroundImage;
          if(bg1==bg2){ //成功配对
            fboxid.querySelector('[data-fid="'+data1+'"]').classList.add('done');
            fboxid.querySelector('[data-fid="'+data2+'"]').classList.add('done');
            data1 = data2 = null;
            _this.success = _this.success + 1;
          }else{
            tout = setTimeout(function(){
              fboxid.querySelector('[data-fid="'+data1+'"]').classList.remove('on');
              fboxid.querySelector('[data-fid="'+data2+'"]').classList.remove('on');
              data1 = data2 = null;
              tout = null;
            },1000);
          }
          _this.step++; //计数器
        }
        //判断游戏进程
        if(_this.success==total)alert('恭喜你，游戏通关！');
      });
    }
  };

  //数组取值
  function arrforone(items)
  {
    let item = items[Math.floor(Math.random()*items.length)];
    return item;
  }

  //删除数组里特定值
  function delarr(arr,a)
  {
    if(!arr || !a){
      return false;
    }
    let newarr = new Array();
    for(let i=0;i<arr.length;i++){
      if(arr[i]!=a){
        newarr.push(arr[i]);
      }
    }
    return newarr;
  }

  //随机范围取不重复值
  function randomNum(n,m,arr)
  {
    let result = Math.round(Math.random()*(m-n))+n;
    if(arr)
      for(let i=0;i<arr.length;i++)
        if(arr[i]==result)
          return randomNum(n,m,arr);
    return result;
  }

  //极限分配法
  function average(total,pageid)
  {
    if(pageid>total){
      return false;
    }
    let parr = new Array();
    if(Math.floor(total/pageid) === total/pageid){ //整除
      isfix = true;
      psize = total/pageid;
    }else{ //非整除
      isfix = false;
      psize = Math.ceil(total/pageid); //向上取整
    }
    if(isfix === true){
      for(i=0;i<pageid;i++){
        parr.push(psize);
      }
    }else{
      y = 0;
      for(i=0;i<pageid;i++){
        psize = Math.floor(total/pageid);
        y += psize;
        parr.push(psize);
      }
      if(y<total){
        last = total - y;
        for(i=0;i<last;i++){
          parr[i]++;
        }
      }
    }
    return parr;
  }
  return fbox;
};