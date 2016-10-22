/**
 * Created by Administrator on 16/8/17.
 */

function formatDate(timestamp) {
    // if (d instanceof Date){
    //
    // }
    // console.log(timestamp + '~~~~~~~~~~~~');
    var date=new Date(timestamp );
    var year = date.getFullYear();
    var month = date.getMonth() + 1;//0代表1月  所以要+1
    var day = date.getDate();
    var time =  year + '-' + month + '-' + day;
    // console.log('~~~~~~~~~~~~' + time);
    return time;
}