/**
 * Created by Administrator on 16/8/16.
 */



window.onload = function myFund() {
    var path = URLBase + '/1.1/portals/toomaoinfo';

    var topUL = document.querySelector('#topUL');
    var top = document.querySelector('#top');

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
                let html = "<li style='width:"+ screenWidth +"px'><img style='width:"+ screenWidth +"px' class='topImage' src='" + topModel.cover +"'><label style='width:"+ screenWidth +"px' class='name'>" + topModel.title + "</label><img class='time'><label class='timeLable'>" + timestamp + "</label><img class='person'><label class='personLabel'>" + topModel.author +"</label><img class='source'><label class='sourceLabel'>" + topModel.from + "</label></li>";
                topHtml += html;
            }

            topUL.innerHTML = topHtml;
            topUL.style.width = topArray.length * screenWidth + 'px';
            var heightUl = topUL.clientHeight;
            // top.style.height = heightUl;
            console.log(topUL.clientHeight , topUL.offsetHeight);

            animationLoop();

        },
        fail: function (status) {

        },
    });


    var  time = null;
    function animationLoop() {
        //    起点
        var star = topUL.offsetLeft;
        // 终点
        var end = -screenWidth * page;
        time = setInterval(function () {
            if (page > topArray.length - 1){
                page = 0;
                topUL.style.left = 0;
            }
            var offset = -screenWidth * page + 'px';
            topUL.style.transitionDuration = '2s';
            topUL.style.transform = "translateX("+offset+")";
            // topUL.style.left = offset;
            page ++;

            console.log( screenWidth * page + '--------' + topUL.style.left);
        }, 5000);
    }
}
