/**
 * Created by Administrator on 16/8/15.
 */

window.onload = function load() {
    var screenWidth = window.screen.availWidth;
    var screenHeight = window.screen.availHeight - 67;

    var navigatorUL = document.querySelector('#kindUL');
    var navigatorItems = document.querySelectorAll('#kindUL a');
    var lastALabelIndex = 0;//记录前一个a标签
    var warp = document.querySelector('#warp');
    var scrollBody = document.querySelector('#scrollBoby');
    var items = document.querySelectorAll('.item');
    var loadNewsFlag = true;//是否请求资讯信息  true:请求

    scrollBody.style.width = 6 * screenWidth + 'px';
    warp.style.height = screenHeight + 'px';

    for (var i = 0; i < items.length; i ++){
        var item = items[i];
        item.style.width = screenWidth + 'px';
    }

    //手势控制分页
    var scrollLeft;
    var startX, startY;
    var scrollDistance = 0;

    scrollBody.addEventListener('touchstart', function (e) {
        // e.preventDefault();
        scrollDistance = 0;
        var touch = e.touches[0];
        scrollLeft = scrollBody.offsetLeft;
        startX= touch.clientX;
        startY= touch.clientY;
    });

    scrollBody.addEventListener('touchmove', function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        scrollDistance = touch.clientX - startX;
        var newOffset = scrollLeft + scrollDistance;
        scrollBody.style.left = newOffset + 'px';
    });

    scrollBody.addEventListener('touchend', function (e) {
        // e.preventDefault();
        if (Math.abs(scrollDistance) < 10) return;
        if (Math.abs(scrollDistance) > screenWidth/2.0){
            if (scrollDistance > 0){
                scrollLeft += screenWidth;
            }else {
                scrollLeft -= screenWidth;
            }
        }
        if (scrollLeft > 0){
            scrollLeft = 0;
        }
        if (scrollLeft < -5*screenWidth){
            scrollLeft = -5*screenWidth;
        }
        scrollBody.style.left = scrollLeft + 'px';
        //处理导航条的标签
        var index = Math.abs(scrollLeft/screenWidth);
        navigatorOffset(index);
        console.log(scrollBody.style.left,'------end--------',scrollLeft);
    });

    var itemsDivs = document.querySelectorAll('.item');
    //控制导航偏移
    function navigatorOffset(index) {

        var itemDiv = itemsDivs[0];
        itemDiv.offsetHeight = 'auto';

        if(index == 5){//&& loadNewsFlag
            requestTooMaoNews();
        }
        var lastA = navigatorItems[lastALabelIndex];
        lastA.id = '';
        var newA = navigatorItems[index];
        newA.id = 'selected';
        lastALabelIndex = index;
        var hideA = document.querySelector('#hideA');
        if (index > 2){
            hideA.href = '#offset';
        }else {
            hideA.href = '#header';
        }
        hideA.click();
    }

    //导航标签点击
    for (var i = 0; i < navigatorItems.length; i ++){
        var a = navigatorItems[i];
        a.onclick = function () {
            navigatorOffset(i);
            var offset = -screenWidth*i;
            scrollBody.style.left = offset + 'px';
        }
    }


    //土冒合伙人
    document.querySelector('#commit').onclick = function () {
        var userName = document.getElementById('name').value;
        var phone = document.getElementById('phone').value;
        var area = document.getElementById('area').value;
        if(!userName){
            alert('请输入用户名');
        }else if (!phone){
            alert('请输入电话号码');
        }else if (!area){
            alert('请输入代理地区');
        }else {
            alert('稍等 我去 发请求');
        }
        console.log('commit partner info')
    }




    //土冒资讯页的数据请求
    function requestTooMaoNews() {

        loadNewsFlag = false;

        var path = URLBase + '/1.1/portals/toomaoinfo';
        var topUL = document.querySelector('#topUL');
        var top = document.querySelector('#top');
        var listUL = document.querySelector('#listUL');

        var screenWidth = window.screen.availWidth;
        var page = 0;
        var topArray = [];
        var results = [];
        //请求数据
        ajax({
            url: path,
            success:function (responseText) {
                // console.log(responseText);
                var newsModel = JSON.parse(responseText);
                topArray = newsModel['top'];
                results = newsModel['results'];
                var topHtml = '';
                var resultsHtml = '';
                for (var i = 0; i < topArray.length; i ++){
                    var topModel = topArray[i];
                    var timestamp = formatDate(topModel.lastUpdated);
                    var html = "<li style='width:"+ screenWidth +"px'><img style='width:"+ screenWidth +"px' class='topImage' src='" + topModel.cover +"'><label style='width:"+ screenWidth +"px' class='name'>" + topModel.title + "</label><div class='info'><img class='time' src='../../Images/News/time.png'><label class='timeLable'>" + timestamp + "</label><img class='person' src='../../Images/News/author.png'><label class='personLabel'>" + topModel.author +"</label><img class='source' src='../../Images/News/source.png'><label class='sourceLabel'>" + topModel.from + "</label></div></li>";
                    topHtml += html;
                }

                for (var  i = 0; i < results.length; i ++){
                    var resultModel = results[i];
                    var timestamp = formatDate(resultModel.lastUpdated);
                    var html = "<li><img class='topImage' src='" + resultModel.cover +"'><label class='name'>" + resultModel.title + "</label><div class='info'><img class='time'  src='../../Images/News/time.png'><label class='timeLable'>" + timestamp + "</label><img class='person' src='../../Images/News/author.png'><label class='personLabel'>" + resultModel.author +"</label><img class='source' src='../../Images/News/source.png'><label class='sourceLabel'>" + resultModel.from + "</label></div></li>";
                    resultsHtml += html;
                }

                topUL.innerHTML = topHtml;
                topUL.style.width = topArray.length * screenWidth + 'px';

                listUL.innerHTML = resultsHtml;
                //开启定时器动画
                animationLoop();
                //添加资讯列表的点击事件
                addListClickEvent();

            },
            fail: function (status) {

            },
        });

        //滚动动画
        var  time = null;
        var topLetf = 0;
        function animationLoop() {
            clearInterval(time);
            time = setInterval(function () {
                page ++;
                if (page > topArray.length - 1){
                    page = 0;
                }
                var scrollOffset = -screenWidth * page + 'px';
                topUL.style.transitionDuration = '1s';
                topUL.style.transform = "translateX("+scrollOffset+")";
                console.log('page'+page + '     ------        ' + topUL.offsetLeft,  scrollOffset);

            }, 5000);
        }

        var startX, startY;
        var direction;
        //手势控制滚动
        topUL.addEventListener('touchstart', function (e) {
            // e.preventDefault();//阻止纵向移动
            topLetf = topUL.offsetLeft;
            var touch = e.touches[0];
            //获取起始点的位置
            startX = touch.clientX;
            startY = touch.clientY;

        }, false);

        topUL.addEventListener('touchmove', function (e) {
            // e.preventDefault();
            clearInterval(time);
            var touch = e.touches[0];
            var deltaX = touch.clientX - startX;
            direction = deltaX > 0 ? true : false;
            var offsetScroll = topLetf + deltaX;
            topUL.style.left = offsetScroll  + 'px';

        }, false);

        topUL.addEventListener('touchend', function (e) {
            // e.preventDefault();
            var currentLeft = topUL.offsetLeft;
            if (currentLeft > 0){
                currentLeft = 0;
            }
            if (currentLeft < -(topArray.length - 1)*screenWidth){
                currentLeft = -(topArray.length - 1)*screenWidth;
            }

            var  between = currentLeft - topLetf;
            var surplus = Math.abs(between % screenWidth);
            var offset = 0;
            if (surplus > screenWidth/2.0){
                if (direction){
                    offset = currentLeft - surplus + screenWidth;
                }else {
                    offset = currentLeft + surplus - screenWidth;
                }
            }else {
                if (direction){
                    offset = currentLeft - surplus;
                }else {
                    offset = currentLeft + surplus;
                }
            }
            page = Math.abs(offset/screenWidth);
            topUL.style.left = offset+'px';
            // animationLoop();
        }, false);

        //给资讯添加点击事件
        function addListClickEvent() {
            var topLi = document.querySelectorAll('#topUL li');
            var listLi = document.querySelectorAll('#listUL li');
            for (var i = 0; i < topLi.length; i ++){
                var li = topLi[i];
                li.id = i;
                li.onclick = function (e) {
                    var model = topArray[this.id];
                    console.log(model + 'li ------ click',i,e.target, this.id);
                }
            }

            for (var i = 0; i < listLi.length; i ++){
                var li = listLi[i];
                li.id = i;
                li.onclick = function () {
                    var model = results[this.id];
                    console.log(model+'li ------ click',i);
                }
            }
        }
    }
}