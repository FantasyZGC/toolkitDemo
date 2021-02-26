// 这里直接使用了自己写的一个拖动元素类，之前的博客里有
import DragElement from "./DragElement.js";

// 继承自拖拽元素
class Slider extends DragElement {
    constructor(sliderConf) {
        super(sliderConf.itemContainer, {
            canDragX: true,
            canDragY: false
        })
        // 读取基本配置
        this.sliderBox = sliderConf.sliderBox; // 可视区域
        this.itemContainer = sliderConf.itemContainer; // 轮播图容器
        this.itemName = sliderConf.itemName; // 轮播项目的类名
        this.indicatorContainerName = sliderConf.indicatorContainerName; // 指示器容器类名
        this.indicatorName = sliderConf.indicatorName; // 指示器类名
        this.duration = sliderConf.duration + "s"; // transition 时间
        this.interval = sliderConf.interval * 1000; // 切换间隔

        // 用于标记动画是否结束
        this.transComplete = true;

        // 保存所有轮播项目, 列表项的顺序与容器内 item 的顺序相同
        this.itemList = this.setSlideItems(this.itemContainer.querySelectorAll("." + this.itemName));

        // 将 id 为 1 的图放置于 itemList[1] 位置
        this.resetItemOrder();

        // 指示器列表
        this.indicatorList = this.createIndicator(this.sliderBox, this.itemList)

        // 设置定时切换
        this.slideInterval = setInterval(() => {
            this.switchItemToNext(this.itemContainer, this.indicatorList)
        }, this.interval);

        // 切换动画结束时对容器状态进行更新，进行图片重排
        // 这里使用 setTimeout 是为了解决连续点击时状态的重置问题
        this.slideBack = setTimeout(() => {
            this.itemContainer.addEventListener("transitionend", this.setItemToLast);
        }, this.interval / 2);

        // 设置触摸事件
        this.setDragSlide();
    }


    // 为相关元素进行初始排序，并返回对应 item
    setSlideItems = (items) => {
        this.sliderBox.style.position = "relative";
        this.itemContainer.style.position = "absolute";
        this.itemContainer.style.right = "100%";
        let list = [];
        for (let i = 0; i < items.length; i++) {
            items[i].id = this.itemName + "-" + (i + 1);
            items[i].style.order = i;
            list.push(items[i]);
        }
        return list;
    }

    // 重置顺序
    resetItemOrder = () => {
        for (let i = 0; i < this.itemList.length - 1; i++) {
            this.setItemToLast();
        }
    }

    // 切换下一张
    switchItemToNext = (itemContainer, indicatorList) => {
        this.transComplete = false; // 动画开始
        itemContainer.style.transition = this.duration;
        itemContainer.style.transform = "translate(-100%,0)";
        this.changeIndex(indicatorList, 1);
    }

    // 将显示页的前一张移动到最后
    setItemToLast = () => {
        this.transComplete = true;
        this.itemContainer.style.transition = "";
        this.itemContainer.style.transform = "translate(0,0)";
        let box = this.itemList.shift();
        box.style.order = this.itemList.length;
        this.itemList.map((item) => {
            --item.style.order;
        })
        this.itemList.push(box);
    }

    // 将最后一张图移动到显示页之前
    setItemToFirst = () => {
        this.transComplete = true;
        this.itemContainer.style.transition = "";
        this.itemContainer.style.transform = "translate(0,0)";
        let box = this.itemList.pop();
        box.style.order = "0";
        this.itemList.map((item) => {
            ++item.style.order;
        })
        this.itemList.unshift(box);
    }

    // 插入指示器
    createIndicator = (positionEle, itemList) => {
        let indicator_itemContainer = document.createElement("div");
        indicator_itemContainer.className = this.indicatorContainerName;
        positionEle.appendChild(indicator_itemContainer);
        let indicatorList = []
        for (let i = 0; i < itemList.length; i++) {
            let indicator = document.createElement("div");
            indicator.className = this.indicatorName;
            indicator.style.order = i * 2;
            indicatorList.push(indicator);
            indicator_itemContainer.appendChild(indicator);
        }
        indicatorList[0].style.order = 1;
        indicatorList[0].classList.add(this.indicatorName + "-highlight");
        return indicatorList;
    }

    // 切换指示器
    changeIndex = (indicatorList, offset) => {
        offset = offset || 0;
        indicatorList.map(item => {
            item.className = this.indicatorName;
        })
        let viewItemId = parseInt(this.itemList[1].id.split("-").pop());
        let index = (viewItemId + offset - 1) % indicatorList.length;
        indicatorList[index].classList.add(this.indicatorName + "-highlight");
    }

    setDragSlide = () => {
        // 停止定时切换
        this.itemContainer.addEventListener("touchstart", () => {
            // 先清除动画结束时的图片重排，根据具体情况再进行设置
            this.itemContainer.style.transition = "";
            clearInterval(this.slideInterval);
            this.slideInterval = null;
            clearTimeout(this.slideBack);
            // 如果一次完整的动画没有完成，则先完成这次动画
            if (this.transComplete == false || this.itemContainer.style.transform == "translate(-100%, 0px)") {
                this.setItemToLast();
            }
        })

        // 关键点，请记住，x1 表示的是拖动的距离
        this.itemContainer.addEventListener("touchmove", () => {
            // 正向拖动（朝左）拖完一个图片，就将那个图片放到最后，x1 回退一个图片距离
            if (document.dragController.x1 < -this.itemContainer.offsetWidth) {
                this.setItemToLast();
                this.changeIndex(this.indicatorList, 0);
                document.dragController.x1 += this.itemContainer.offsetWidth;
            } else if (document.dragController.x1 > 0) {
                // 反向拖动（朝右）时，需要将末尾的图片连到当前页面前，同样的 x1 回退一个图片距离
                this.setItemToFirst();
                this.changeIndex(this.indicatorList, 1);
                document.dragController.x1 -= this.itemContainer.offsetWidth;
            }
        })

        // 拖动结束
        this.itemContainer.addEventListener("touchend", () => {
            this.itemContainer.removeEventListener("transitionend", this.setItemToLast);
            // 拖动超过一半，则显示下一张
            if (document.dragController.x1 % this.itemContainer.offsetWidth < -this.itemContainer.offsetWidth / 2) {
                this.itemContainer.style.transition = this.duration;
                this.itemContainer.style.transform = "translate(-100%,0)";
                this.changeIndex(this.indicatorList, 1);
                // 立即添加动画完成后的图片重排
                this.itemContainer.addEventListener("transitionend", this.setItemToLast);
            } else {
                // 拖动未超过一半，回归到原来的图片
                this.itemContainer.style.transition = this.duration;
                this.itemContainer.style.transform = "translate(0,0)";
                this.changeIndex(this.indicatorList, 0);
                // 本次动画完成后，不必重排，下一次动画开始前添加响应即可
                this.slideBack = setTimeout(() => {
                    this.itemContainer.addEventListener("transitionend", this.setItemToLast);
                }, this.interval / 2)
            }
            // 增加一定健壮性，防止多指触摸导致的重复添加
            if (this.slideInterval == null) this.slideInterval = setInterval(() => {
                this.switchItemToNext(this.itemContainer, this.indicatorList);
            }, this.interval);
            // 这里的 x 保存的是拖动结束时的位置，清空
            this.itemContainer.dragStatus.x = 0;
        })
    }
}

export default Slider