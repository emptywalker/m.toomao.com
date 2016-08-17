/**
 * Created by Administrator on 16/8/17.
 */

function formatDate(timestamp) {
    var date=new Date(timestamp);
    let year = date.getFullYear();
    let  month = date.getMonth();
    let day = date.getDay();

    return year + '-' + month + '-' + day;
}