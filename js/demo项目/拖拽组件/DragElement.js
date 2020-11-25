class DragElement {
    constructor(element, setting) {
        this.element = element
        this.dragActive() // 进行相应的配置
        // 为该元素添加一个对象，保存当前位置
        this.setting = setting ? setting : {
            canDragX: true,
            canDragY: true
        }
        this.element.dragStatus = {
            x: 0,
            y: 0,
            canDragX: this.setting.canDragX,
            canDragY: this.setting.canDragY
        }
    }

    // 更新鼠标位置
    updateDragPosition = (event) => {
        return {
            x: event.clientX || (event.changedTouches ? event.changedTouches[0].pageX : document.dragController.x0),
            y: event.clientY || (event.changedTouches ? event.changedTouches[0].pageY : document.dragController.y0)
        }
    }

    // 为元素配置相应的拖拽控制函数
    dragActive = () => {
        if (!this.element) return
        if (window.getComputedStyle(this.element).getPropertyValue("display") == "inline") this.element.style.display = "block"
        this.element.addEventListener('mousedown', this.dragStart, false)
        this.element.addEventListener('touchstart', this.dragStart, false)
        this.element.addEventListener('mouseup', this.dragEnd, false) // 释放
        this.element.addEventListener('touchend', this.dragEnd, false)
        this.element.addEventListener('touchcancel', this.dragEnd, false)

    }

    // 释放配置
    dragRelease = () => {
        this.element.removeEventListener('mousedown', this.dragStart)
        this.element.removeEventListener('touchstart', this.dragStart)
        this.element.removeEventListener('mouseup', this.dragEnd) // 释放
        this.element.removeEventListener('touchend', this.dragEnd)
        this.element.removeEventListener('touchcancel', this.dragEnd)
        this.element.style.display = ""
        delete document.dragController
        return this.element
    }

    // 点击捕获拖拽元素，初始化相应信息
    dragStart = (event) => {
        document.dragController = {
            element: this.element,
            x0: this.updateDragPosition(event).x,
            y0: this.updateDragPosition(event).y,
            x1: this.element.dragStatus.x,
            y1: this.element.dragStatus.y,
            updateDragPosition: this.updateDragPosition,
            canDragX: this.setting.canDragX,
            canDragY: this.setting.canDragY
        }
        // move 绑定在 document 上，防止鼠标过快可能导致的元素丢失
        document.addEventListener('mousemove', this.dragMoving, false)
        document.addEventListener('touchmove', this.dragMoving, false)
        // 屏蔽默认行为
        event.preventDefault();
    }

    // 实时计算、更新相对位置变化
    dragMoving = (event) => {
        let drag = document.dragController
        drag.canDragX && (drag.x1 = drag.updateDragPosition(event).x - drag.x0 + drag.x1)
        drag.canDragY && (drag.y1 = drag.updateDragPosition(event).y - drag.y0 + drag.y1)
        drag.canDragX && (drag.x0 = drag.updateDragPosition(event).x)
        drag.canDragY && (drag.y0 = drag.updateDragPosition(event).y)
        drag.element.style.transform = 'translate(' + drag.x1 + 'px, ' + drag.y1 + 'px)';
        // drag.element.style.transform = 'translate3d(' + drag.x1 + 'px, ' + drag.y1 + 'px, 0)';
    }

    // 关闭拖拽
    dragEnd = () => {
        // 保存当前位置
        this.element.dragStatus.x = document.dragController.x1
        this.element.dragStatus.y = document.dragController.y1
        // 解绑
        document.removeEventListener('touchmove', this.dragMoving)
        document.removeEventListener('mousemove', this.dragMoving)
    }
}

export default DragElement