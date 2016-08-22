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
    var scrollDistance;

    scrollBody.addEventListener('touchstart', function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        scrollLeft = scrollBody.offsetLeft;
        startX= touch.clientX;
        startY= touch.clientY;
        // console.log('start Point', startX);

    }, false);

    scrollBody.addEventListener('touchmove', function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        scrollDistance = touch.clientX - startX;
        let newOffset = scrollLeft + scrollDistance;
        scrollBody.style.left = newOffset + 'px';
        // console.log( scrollBody.style.left, 'move Point', scrollDistance);
    }, false);

    scrollBody.addEventListener('touchend', function (e) {
        e.preventDefault();
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
        let index = Math.abs(scrollLeft/screenWidth);
        navigatorOffset(index);
        // console.log(scrollBody.style.left,'------end--------',scrollLeft);
    }, false);

    var itemsDivs = document.querySelectorAll('.item');
    //控制导航偏移
    function navigatorOffset(index) {

        var itemDiv = itemsDivs[0];
        console.log('before ------ '+itemDiv.offsetHeight);
        itemDiv.offsetHeight = 'auto';
        console.log('after ------ '+itemDiv.offsetHeight);

        // if(index == 5 && loadNewsFlag){
            // requestTooMaoNews();
        // }
        requestTooMaoNews();
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
    for (let i = 0; i < navigatorItems.length; i ++){
        var a = navigatorItems[i];
        a.onclick = function () {
            navigatorOffset(i);
            let offset = -screenWidth*i;
            scrollBody.style.left = offset + 'px';
        }
    }

    //土冒资讯页的数据请求
    function requestTooMaoNews() {

        loadNewsFlag = false;

        var path = URLBase + '/1.1/portals/toomaoinfo';
        var topUL = document.querySelector('#topUL');
        var top = document.querySelector('#top');
        var listUL = document.querySelector('#listUL');

        var screenWidth = window.screen.availWidth;
        // document.body.clientWidth;
        var page = 0;
        var topArray = [];
        //请求数据
        ajax({
            url: path,
            success:function (responseText) {
                // console.log(responseText);
                var newsModel = JSON.parse(responseText);
                topArray = newsModel['top'];
                var results = newsModel['results'];
                var topHtml = '';
                var resultsHtml = '';
                for (var i = 0; i < topArray.length; i ++){
                    let topModel = topArray[i];
                    let timestamp = formatDate(topModel.lastUpdated);
                    let html = "<li style='width:"+ screenWidth +"px'><img style='width:"+ screenWidth +"px' class='topImage' src='" + topModel.cover +"'><label style='width:"+ screenWidth +"px' class='name'>" + topModel.title + "</label><div class='info'><img class='time'><label class='timeLable'>" + timestamp + "</label><img class='person'><label class='personLabel'>" + topModel.author +"</label><img class='source'><label class='sourceLabel'>" + topModel.from + "</label></div></li>";
                    topHtml += html;
                }

                for (var  i = 0; i < results.length; i ++){
                    let resultModel = results[i];
                    let timestamp = formatDate(resultModel.lastUpdated);
                    let html = "<li><img class='topImage' src='" + resultModel.cover +"'><label class='name'>" + resultModel.title + "</label><div class='info'><img class='time'><label class='timeLable'>" + timestamp + "</label><img class='person'><label class='personLabel'>" + resultModel.author +"</label><img class='source'><label class='sourceLabel'>" + resultModel.from + "</label></div></li>";
                    resultsHtml += html;
                }

                topUL.innerHTML = topHtml;
                topUL.style.width = topArray.length * screenWidth + 'px';

                listUL.innerHTML = resultsHtml;

                var heightUl = topUL.clientHeight;
                // top.style.height = heightUl;
                console.log(topUL.clientHeight , topUL.offsetHeight);

                // animationLoop();

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
                console.log('page'+page + '     ------        ' + topUL.offsetLeft);
                var scrollOffset = -screenWidth * page + 'px';
                topUL.style.transitionDuration = '1s';
                topUL.style.transform = "translateX("+scrollOffset+")";
                // topUL.style.left = scrollOffset+'px';
            }, 5000);
        }

        var startX, startY;
        var direction;

        //手势控制滚动
        topUL.addEventListener('touchstart', function (e) {
            e.preventDefault();//阻止纵向移动
            topLetf = topUL.offsetLeft;
            var touch = e.touches[0];
            //获取起始点的位置
            startX = touch.clientX;
            startY = touch.clientY;

        }, false);

        topUL.addEventListener('touchmove', function (e) {
            e.preventDefault();
            clearInterval(time);
            var touch = e.touches[0];
            var deltaX = touch.clientX - startX;
            direction = deltaX > 0 ? true : false;
            let offsetScroll = topLetf + deltaX;
            // topUL.style.transform = "translateX("+offsetScroll+"px)";

            topUL.style.left = offsetScroll  + 'px';
        }, false);

        topUL.addEventListener('touchend', function (e) {
            e.preventDefault();
            //这个触摸点的数组是空的
            // var touch = e.touches[0];

            var currentLeft = topUL.offsetLeft;
            if (currentLeft > 0){
                currentLeft = 0;
            }
            if (currentLeft < -(topArray.length - 1)*screenWidth){
                currentLeft = -(topArray.length - 1)*screenWidth;
            }

            let  between = currentLeft - topLetf;
            var surplus = Math.abs(between % screenWidth);
            let offset = 0;
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

            // topUL.style.transitionDuration = '1s';
            // topUL.style.transform = "translateX("+offset+"px)";
            topUL.style.left = offset+'px';
            animationLoop();
        }, false);
    }
}