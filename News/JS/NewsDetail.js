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
    var lead = document.querySelector('#lead');
    var leadContent = document.querySelector('#lead .content');

    var content = document.querySelector('#content');
    ajax({
        url:path,
        success: function(responseText){
            var infoModel = JSON.parse(responseText);
            topImage.src = infoModel.cover;
            name.textContent = infoModel.title;
            var timestamp = formatDate(infoModel.lastUpdated);
            //如果作者或者来源  有就显示  没有就不显示
            var author = '';
            var from = '';
            if(infoModel.author.replace(/(^\s*)|(\s*$)/g, "").length != 0){
                author = "<img class='person' src='../../Images/News/author.png'><label class='personLabel'>" + infoModel.author +"</label>";
            }
            if (infoModel.from.replace(/(^\s*)|(\s*$)/g, "").length != 0){
                from = "<img class='source' src='../../Images/News/source.png'><label class='sourceLabel'>" + infoModel.from + "</label>";
            }
            var html = "<img class='time' src='../../Images/News/time.png'><label class='timeLable'>" + timestamp + "</label>" + author + from;
            info.innerHTML = html;
            leadContent.textContent = infoModel.lead;
            if(infoModel.lead.replace(/(^\s*)|(\s*$)/g, "").length == 0){
                lead.style.display = 'none';
            }
            content.innerHTML = infoModel.content;

        },
        fail: function (status) {

        }
    });
}