/**
 * Created by Administrator on 16/8/25.
 */


window.onload = function () {
    var id = getQueryString('id');
    var path = URLBase + '/1.1/system/info/' + id;

    //DOM
    var topImage = document.querySelector('#header img');
    var name = document.querySelector('#header label');
    var info =  document.querySelector('#header .info');
    var leadContent = document.querySelector('#lead .content');

    var content = document.querySelector('#content');
    ajax({
        url:path,
        success: function(responseText){
            var infoModel = JSON.parse(responseText);
            content.innerHTML = infoModel.content;
            topImage.src = infoModel.cover;
            name.textContent = infoModel.title;
            var timestamp = formatDate(infoModel.lastUpdated);
            var html = "<img class='time' src='../../Images/News/time.png'><label class='timeLable'>" + timestamp + "</label><img class='person' src='../../Images/News/author.png'><label class='personLabel'>" + infoModel.author +"</label><img class='source' src='../../Images/News/source.png'><label class='sourceLabel'>" + infoModel.from + "</label>";
            info.innerHTML = html;
            leadContent.textContent = infoModel.lead;
        },
        fail: function (status) {

        }
    });
}