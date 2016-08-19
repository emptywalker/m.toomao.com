/**
 * Created by Administrator on 16/8/15.
 */

window.onload = function () {
    var screenWidth = window.screen.availWidth;
    var screenHeight = window.screen.availHeight - 67;

    var navigatorUL = document.querySelector('#kindUL');
    var navigatorItems = document.querySelectorAll('#kindUL a');
    var lastALabelIndex = 0;//记录前一个a标签
    var warp = document.querySelector('#warp');
    var scrollBody = document.querySelector('#scrollBoby');
    var items = document.querySelectorAll('.item');

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

        console.log(scrollBody.style.left,'------end--------',scrollLeft);
    }, false);

    function navigatorOffset(index) {
        var lastA = navigatorItems[lastALabelIndex];
        lastA.id = '';
        var newA = navigatorItems[index];
        newA.id = 'selected';
        lastALabelIndex = index;

        if (index > 2){
            let navigatorOffset = -80 * index;
            document.querySelector('.hideA').click();
            // navigatorUL.style.left = navigatorOffset + 'px';

        }
    }

}