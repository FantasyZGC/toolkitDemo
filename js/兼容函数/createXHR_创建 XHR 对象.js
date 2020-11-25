// 兼容性的 XHR 对象封装
function createXHR() {
    // 判断浏览器是否支持 XMLHttpRequest，针对 IE7, firefox, opera 等
    if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != "undefined") {
        // 将各种 ActiveXObject 版本放在一个数组里
        var xhrArr = [
            "Microsoft.XMLHTTP",
            "MSXML2.XMLHTTP.6.0",
            "MSXML2.XMLHTTP.5.0",
            "MSXML2.XMLHTTP.4.0",
            "MSXML2.XMLHTTP.3.0",
            "MSXML2.XMLHTTP.2.0",
        ];
        // 遍历创建 XHR 对象
        var len = xhrArr.length;
        for (let i = 0; i < len; i++) {
            try {
                // 创建 XHR 对象
                var xhr = new ActiveXObject(xhrArr[i]);
                break;
            } catch (error) {

            }
            return xhr;
        }
    } else {
        throw new Error("No XHR object available");
    }
}