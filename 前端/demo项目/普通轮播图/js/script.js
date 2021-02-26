function bannerChange() {
    /**
     * ------------------------------
     * 添加事件的兼容封装
     * ------------------------------
     */
    function addEventHandler(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }

    /**
     * ----------------------------
     * 自动轮播部分
     * ----------------------------
     */

    //相关DOM
    var itemList = document.querySelectorAll(".item"),
        img = document.querySelector(".banner img"),
        imgLink = document.querySelector(".banner a"),
        box = document.querySelector(".banner-box");

    // 图片轮播所需的指针和文件名
    var dirName = "./img/",
        imgNameList = ["1.jpg", "3.jpg", "4.jpg", "5.jpg"],
        imgLinkList = ["#1", "#3", "#4", "#5"],
        imgNum = imgNameList.length,
        imgId = 0;

    // 根据指针切换图片与链接
    function changeImg() {
        for (var i = 0; i < imgNum; i++) {
            itemList[i].className = "item";
        }
        //改变图片src
        img.src = dirName + imgNameList[imgId];
        imgLink.href = imgLinkList[imgId];
        itemList[imgId].setAttribute("class", "item checked");

    };

    // 轮播函数
    var autoChangeImg;
    function startChangeImg() {
        autoChangeImg = setInterval(function () {
            imgId++;
            if (imgId >= imgNum) {
                imgId = 0;
            }
            changeImg();
        }, 1000);
    };


    /**
     * ----------------------------
     * 事件部分
     * ----------------------------
     */

    // 鼠标进入box时暂停轮播;
    function stopChangeImg() {
        clearInterval(autoChangeImg);
    }
    addEventHandler(box, "mouseover", stopChangeImg);

    // 鼠标离开时box时重新开始轮播
    addEventHandler(box, "mouseout", startChangeImg);

    // 鼠标点击标题，进行内容切换
    for (var i = 0; i < imgNum; i++) {
        (function (i) {
            addEventHandler(itemList[i], "click", function () {
                imgId = i;
                changeImg();
            })
        })(i)

    }

    //-------------------------------------
    // 开始轮播
    startChangeImg();
}



