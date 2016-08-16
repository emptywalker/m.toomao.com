/**
 * Created by Administrator on 16/8/16.
 */

console.log('sadsajlkdnsalkjndjkas');


window.onload = function muFun() {
    document.getElementById('commite').onclick = function () {
        let userName = document.getElementById('name').value;
        let phone = document.getElementById('phone').value;
        let area = document.getElementById('area').value;
        if(!userName){
            alert('请输入用户名');
        }else if (!phone){
            alert('请输入电话号码');
        }else if (!area){
            alert('请输入代理地区');
        }else {
            alert('稍等 我去 发请求');
        }
    }

}





