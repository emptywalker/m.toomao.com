/**
 * Created by Administrator on 16/8/16.
 */


document.addEventListener('readystatechange', function(e) {
    if (document.readyState === 'interactive') {

        //处理导航条
        var screenWidth = window.screen.availWidth;
        var kindWidth = screenWidth - 70;
        document.querySelector('#kind').style.width = kindWidth + 'px';
        //调整导航条位置
        document.querySelector('.hideA').click();
    }
});


window.onload = function myFund() {

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
            var nameLabelWidth = screenWidth - 102;
            for (var i = 0; i < topArray.length; i ++){
                var topModel = topArray[i];
                var timestamp = formatDate(topModel.lastUpdated);
                //如果作者或者来源  有就显示  没有就不显示
                var author = '';
                var from = '';

                if(topModel.author.replace(/(^\s*)|(\s*$)/g, "").length != 0){
                    author = "<img class='person' src='../../Images/News/author.png'><label class='personLabel'>" + topModel.author +"</label>";
                }
                if (topModel.from.replace(/(^\s*)|(\s*$)/g, "").length != 0){
                    from = "<img class='source' src='../../Images/News/source.png'><label class='sourceLabel'>" + topModel.from + "</label>";
                }
                var html = "<li style='width:"+ screenWidth +"px'><img class='topImage' style='width:"+ screenWidth +"px; background-image:url(" + topModel.cover +");  background-size:cover; background-position: center center;'><label style='width:"+ screenWidth +"px' class='name'>" + topModel.title + "</label><div class='info'><img class='time' src='../../Images/News/time.png'><label class='timeLable'>" + timestamp + "</label>"+author+from+"</div></li>";
                topHtml += html;
            }

            for (var  i = 0; i < results.length; i ++){
                var resultModel = results[i];
                var timestamp = formatDate(resultModel.lastUpdated);
                //如果作者或者来源  有就显示  没有就不显示
                var author = '';
                var from = '';
                if(resultModel.author.replace(/(^\s*)|(\s*$)/g, "").length != 0){
                    author = "<img class='person' src='../../Images/News/author.png'><label class='personLabel'>" + resultModel.author +"</label>";
                }
                if (resultModel.from.replace(/(^\s*)|(\s*$)/g, "").length != 0){
                    from = "<img class='source' src='../../Images/News/source.png'><label class='sourceLabel'>" + resultModel.from + "</label>";
                }

                var html = "<li><img class='topImage' style='background-image:url(" + resultModel.cover +");  background-size:cover; background-position: center center;'><label class='name' style='width: "+nameLabelWidth+"px'>" + resultModel.title + "</label><div class='info'><img class='time' src='../../Images/News/time.png'><label class='timeLable'>" + timestamp + "</label>"+author+from+"</div></li>";
                resultsHtml += html;
            }

            topUL.innerHTML = topHtml;
            topUL.style.width = topArray.length * screenWidth + 'px';

            listUL.innerHTML = resultsHtml;

            var heightUl = topUL.clientHeight;
            // top.style.height = heightUl;
            console.log(topUL.clientHeight , topUL.offsetHeight);

            animationLoop();
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
            // topUL.style.left = scrollOffset+'px';
            // console.log(scrollOffset +'----page----'+page + '     ------        ' + topUL.offsetLeft);

        }, 3000);
    }

    // var startX, startY;
    // var direction;
    // //手势控制滚动
    topUL.addEventListener('touchstart', function (e) {
    //     e.preventDefault();//阻止纵向移动
        topLetf = topUL.offsetLeft;
    //     var touch = e.touches[0];
    //     //获取起始点的位置
    //     startX = touch.clientX;
    //     startY = touch.clientY;
    //     console.log('---------stsar----------------')
    //
    }, false);
    //
    topUL.addEventListener('touchmove', function (e) {
    //     e.preventDefault();
    //     clearInterval(time);
    //     var touch = e.touches[0];
    //     var deltaX = touch.clientX - startX;
    //     direction = deltaX > 0 ? true : false;
    //     var offsetScroll = topLetf + deltaX;
    //     // topUL.style.transform = "translateX("+offsetScroll+"px)";
    //
    //     topUL.style.left = offsetScroll  + 'px';
    //     topUL.style.left = topLetf+'px';
        // console.log(topLetf+'---------moving----------------')
    }, false);
    //
    topUL.addEventListener('touchend', function (e) {
    //     e.preventDefault();
    //     //这个触摸点的数组是空的
    //     // var touch = e.touches[0];
    //
    //     var currentLeft = topUL.offsetLeft;
    //     if (currentLeft > 0){
    //         currentLeft = 0;
    //     }
    //     if (currentLeft < -(topArray.length - 1)*screenWidth){
    //         currentLeft = -(topArray.length - 1)*screenWidth;
    //     }
    //
    //     var  between = currentLeft - topLetf;
    //     var surplus = Math.abs(between % screenWidth);
    //     var offset = 0;
    //     if (surplus > screenWidth/2.0){
    //         if (direction){
    //             offset = currentLeft - surplus + screenWidth;
    //         }else {
    //             offset = currentLeft + surplus - screenWidth;
    //         }
    //     }else {
    //         if (direction){
    //             offset = currentLeft - surplus;
    //         }else {
    //             offset = currentLeft + surplus;
    //         }
    //     }
    //     page = Math.abs(offset/screenWidth);
    //
    //     // topUL.style.transitionDuration = '1s';
    //     // topUL.style.transform = "translateX("+offset+"px)";
    //     topUL.style.left = offset+'px';
    //     animationLoop();
        topUL.style.left = topLetf+'px';
        // console.log(topUL.offsetLeft+'---------end----------------')
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
                var id = model._id;
                window.location.href = '../Html/NewsDetail.html?id='+id;
            }
        }

        for (var i = 0; i < listLi.length; i ++){
            var li = listLi[i];
            li.id = i;
            li.onclick = function () {
                var model = results[this.id];
                var id = model._id;
                window.location.href = '../Html/NewsDetail.html?id='+id;
            }
        }
    }
}
