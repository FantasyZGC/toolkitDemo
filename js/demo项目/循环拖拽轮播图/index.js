// 这里直接使用了自己写的一个拖动元素类，之前的博客里有
import DragElement from "./DragElement.js";

// 将容器变为可拖动
let container = document.querySelector(".container")
new DragElement(container, {
    canDragX: true,
    canDragY: false
})

let box; // 用于保存需要被移位的首尾图片
let list = [] // 项目列表
container.querySelectorAll(".box").forEach(item => {
    list.push(item)
})

// 切换下一张
let switchBoxToNext = () => {
    container.style.transition = "0.5s"
    container.style.transform = "translate(-100%,0)"
}

// 将显示页的前一张移动到最后
let resetBoxToBack = () => {
    container.style.transition = ""
    container.style.transform = "translate(-100%,0)"
    box = list.shift()
    box.style.order = list.length;
    list.map((item) => {
        item.style.order--;
    })
    list.push(box)
    container.style.transform = "translate(0,0)"
}

// 将最后一张图移动到显示页之前
let resetBoxToFront = () => {
    container.style.transition = ""
    container.style.transform = "translate(-100%,0)"
    box = list.pop()
    box.style.order = "0";
    list.map((item) => {
        item.style.order++;
    })
    list.unshift(box)
}

// 定时切换
let slideInterval = setInterval(switchBoxToNext, 2000)

// 切换动画结束时对容器状态进行更新，进行图片重排
// 这里使用 setTimeout 是为了解决连续点击时状态的重置问题
let slideBack = setTimeout(() => {
    container.addEventListener("transitionend", resetBoxToBack)
    container.addEventListener("transitioncancel", resetBoxToBack)
}, 0);;

// 停止定时切换
container.addEventListener("touchstart", () => {
    // 先清除动画结束时的图片重排，根据具体情况再进行设置
    container.style.transition = ""
    clearInterval(slideInterval)
    clearTimeout(slideBack)
})

// 关键点，请记住，x1 表示的是拖动的距离
container.addEventListener("touchmove", () => {
    // 正向拖动（朝左）拖完一个图片，就将那个图片放到最后，x1 回退一个图片距离
    if (document.dragController.x1 < -container.offsetWidth) {
        resetBoxToBack()
        document.dragController.x1 += container.offsetWidth;
    } else if (document.dragController.x1 > 0) {
        // 反向拖动（朝右）时，需要将末尾的图片连到当前页面前，同样的 x1 回退一个图片距离
        resetBoxToFront()
        document.dragController.x1 -= container.offsetWidth;
    }
})

// 拖动结束
container.addEventListener("touchend", () => {
    container.removeEventListener("transitionend", resetBoxToBack)
    container.removeEventListener("transitioncancel", resetBoxToBack)
    // 拖动超过一半，则显示下一张
    if (document.dragController.x1 % container.offsetWidth < -container.offsetWidth / 2) {
        container.style.transition = "0.5s"
        container.style.transform = "translate(-100%,0)"
        // 立即添加动画完成后的图片重排
        container.addEventListener("transitionend", resetBoxToBack)
        container.addEventListener("transitioncancel", resetBoxToBack)
    } else {
        // 拖动未超过一半，回归到原来的图片
        container.style.transition = "0.5s"
        container.style.transform = "translate(0,0)"
        // 本次动画完成后，不必重排，下一次动画开始前添加响应即可
        slideBack = setTimeout(() => {
            container.addEventListener("transitionend", resetBoxToBack)
            container.addEventListener("transitioncancel", resetBoxToBack)
        }, 1000)
    }
    slideInterval = setInterval(switchBoxToNext, 2000)
    // 这里的 x 保存的是拖动结束时的位置，清空
    container.dragStatus.x = 0
})

