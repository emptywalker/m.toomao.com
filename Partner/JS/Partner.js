/**
 * Created by Administrator on 16/8/16.
 */

console.log('sadsajlkdnsalkjndjkas');


window.onload = function muFun() {
    //土冒合伙人
    document.querySelector('#commit').onclick = function () {
        var userName = document.getElementById('name').value;
        var phone = document.getElementById('phone').value;
        var area = document.getElementById('area').value;
        if(!userName){
            alert('请输入用户名');
        }else if (!phone){
            alert('请输入电话号码');
        }else if (!area){
            alert('请输入代理地区');
        }else {
            alert('稍等 我去 发请求');
        }
        console.log('commit partner info')
    }
}





