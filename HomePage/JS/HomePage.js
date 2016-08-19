/**
 * Created by Administrator on 16/8/15.
 */

window.onload = function () {
    var screenWidth = window.screen.availWidth;
    var screenHeight = window.screen.availHeight - 67;

    var warp = document.querySelector('#warp');
    var scrollBody = document.querySelector('#scrollBoby');
    var items = document.querySelectorAll('.item');

    scrollBody.style.width = 6 * screenWidth + 'px';
    warp.style.height = screenHeight + 'px';

    for (var i = 0; i < items.length; i ++){
        var item = items[i];
        item.style.width = screenWidth + 'px';
    }

    console.log(warp.offsetWidth);

}