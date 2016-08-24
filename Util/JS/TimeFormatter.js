/**
 * Created by Administrator on 16/8/17.
 */

function formatDate(timestamp) {
    var date=new Date(timestamp);
    var year = date.getFullYear();
    var  month = date.getMonth();
    var day = date.getDay();

    return year + '-' + month + '-' + day;
}