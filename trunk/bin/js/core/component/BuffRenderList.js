var core;
(function (core) {
    /**
     *缓冲渲染列表
     * （1）.用于单帧渲染大量项
     * （2）.用于大量数据列表第一次渲染时间较长
     * @author xy015
     *
     */
    class BuffRenderList extends Laya.Component {
        /**
         * 缓冲渲染列表
         * @param width  宽度
         * @param height 高度
         * @param scrollBar 滚动条
         * @param max 最大渲染数量
         * @param buffRenderSpeed  渲染速度(单帧) 不宜设置过大
         */
        constructor(width, height, scrollBar, max = 0, buffRenderSpeed = 2, useInitBuff = true) {
            super();
            this._itemRenderWidth = 0;
            //
            this._isAutoScroll = false; //是否自动调转到最底部
            this._scrollSize = 8;
            this._offset = 0;
            /** 初始化时 是否缓存(分帧添加列表项) */
            this._useInitBuff = true;
            /*************************** 缓冲渲染优化 ******************************/
            /**
             * 缓冲渲染列表
             */
            this._buffList = new Array();
            /**
             *缓冲渲染列表状态
             */
            this._buffing = false;
            /**
             * 缓冲渲染速度(单位：项/每帧)
             */
            this._buffRenderSpeed = 2;
            this._scrollWidth = width;
            this._scrollHeight = height;
            // this._scrollBar = scrollBar;
            this._max = max;
            this._buffRenderSpeed = buffRenderSpeed;
            this._useInitBuff = useInitBuff;
            this.onCreate();
        }
        onCreate() {
            this._itemsParent = new Laya.Panel();
            this.addChildAt(this._itemsParent, 0);
            this._itemsParent.size(this._scrollWidth, this._scrollHeight);
            this._buffRenderList = [];
            this._items = new Array();
            this._itemsParent.vScrollBarSkin = "";
            this._scrollBar = this._itemsParent.vScrollBar;
            this._scrollBar.scrollSize = this._scrollSize;
            this._scrollBar.on(Laya.Event.CHANGE, this, this.onScrollBarChange);
            this.on(Laya.Event.MOUSE_WHEEL, this, this.onMouseWheel);
        }
        stopScroll() {
            this._scrollBar.stopScroll();
        }
        onRemove() {
            this._buffRenderList.length = 0;
            this._array.length = 0;
            this.removeAll();
            // this._scrollBar.off(Laya.Event.CHANGE,this, this.onScrollBarChange);
            // this.off(Laya.Event.MOUSE_WHEEL,this, this.onMouseWheel);
        }
        /**
         *重新布局列表项的位置
         * @param item
         * @param index
         *
         */
        layoutItem(item, index) {
            item.y = this.sumHeight;
            item.x = 0;
            this.sumHeight += (item.height + this._spaceY);
        }
        /**
         * 重新布局所有列表项的位置
         *
         */
        layoutAllItem() {
            this.sumHeight = 0;
            for (var i = 0; i < this._itemCount; i++) {
                this.layoutItem(this._items[i], i);
            }
            this.onScrollBarChange();
            this.updateScrollMax();
        }
        /**
         * 更新滚动条的最大值
         *
         */
        updateScrollMax() {
            this.callLater(this.scrollToMax);
        }
        /**
         *更新滚动条的最大值
         */
        scrollToMax() {
            var maxValue = (this.sumHeight > this._scrollHeight) ? this.sumHeight - (this._spaceY + this._scrollHeight) : 0;
            var isScroll = true;
            if (this._scrollBar.value < this._scrollBar.max) {
                isScroll = false;
            }
            if (this._offset > maxValue) {
                this.offset = maxValue;
            }
            var $max = this._scrollBar.max;
            this._scrollBar.max = maxValue;
            if (this._isAutoScroll && isScroll) {
                this.setScrollBarValue(maxValue);
            }
        }
        updateScrollMaxForce() {
            Laya.timer.frameOnce(4, this, this.scrollToMaxForce);
        }
        /**
         *强制更新滚动条的最大值
         */
        scrollToMaxForce() {
            var maxValue = (this.sumHeight > this._scrollHeight) ? this.sumHeight - (this._spaceY + this._scrollHeight) : 0;
            if (this._offset > maxValue) {
                this.offset = maxValue;
            }
            this._scrollBar.max = maxValue;
            if (this._isAutoScroll) {
                this.setScrollBarValue(maxValue);
            }
        }
        /**在设置数据源时是否自动显示列表的最后一项*/
        set isAutoScroll(value) {
            this._isAutoScroll = value;
        }
        get isAutoScroll() {
            return this._isAutoScroll;
        }
        /**滚动条 一次滚动的量  这里是像素值*/
        set scrollSize(value) {
            this._scrollSize = value;
        }
        /**Y方向项间隔*/
        get spaceY() {
            return this._spaceY;
        }
        set spaceY(value) {
            this._spaceY = value;
            this.callLater(this.layoutAllItem);
        }
        get scrollBar() {
            return this._scrollBar;
        }
        /**偏移量 坐标偏移*/
        set offset(value) {
            if (this._offset == value)
                return;
            this._offset = value;
            this.refreshRender();
        }
        /**
         * 刷新滚动的区域位置
         *
         */
        refreshRender() {
            this.setScrollBarValue(this._offset);
        }
        /** value:Class */
        set itemRender(value) {
            this._itemRender = value;
        }
        get itemRender() {
            return this._itemRender;
        }
        set itemRenderWidth(value) {
            this._itemRenderWidth = value;
        }
        set max(value) {
            this._max = value;
        }
        get max() {
            return this._max;
        }
        set useInitBuff(value) {
            this._useInitBuff = value;
        }
        get useInitBuff() {
            return this._useInitBuff;
        }
        setScrollChangeHandler(handler, context) {
            this._scrollChangeHandler = handler;
            this._scrollChangeHandlerContext = context;
        }
        onScrollBarChange() {
            var value = Math.round(this._scrollBar.value);
            for (var i = 0; i < this._items.length; i++) {
                var element = this._items[i];
                this.setItemVisiable(element);
            }
            if (value != this._offset) {
                this.offset = value;
            }
        }
        /**
         * 渲染优化，如果不在可视区域内，则隐藏
         * @param item
         */
        setItemVisiable(item) {
            var value = Math.round(this._scrollBar.value);
            let maxvalue = this._scrollHeight + value;
            if (item.y >= value && item.y <= maxvalue) {
                if (!item.visible) {
                    item.visible = true;
                }
            }
            else {
                if (item.y > value) {
                    if (item.visible) {
                        item.visible = false;
                    }
                }
                else {
                    let posy = value - item.y;
                    if (posy < item.height) {
                        if (!item.visible) {
                            item.visible = true;
                        }
                    }
                    else {
                        if (item.visible) {
                            item.visible = false;
                        }
                    }
                }
            }
        }
        onMouseWheel(e) {
            let value = this._scrollBar.value - (e.delta / Math.abs(e.delta)) * this._scrollSize;
            this.setScrollBarValue(value);
        }
        setScrollBarValue(value) {
            if (this._scrollChangeHandler) {
                this._scrollChangeHandler.apply(this._scrollChangeHandlerContext, [value, (value >= this._scrollBar.value ? true : false)]);
            }
            this._scrollBar.value = value;
        }
        scrollBarTo(value) {
            Laya.timer.frameOnce(2, this, this.setScrollBarValue, [value]);
        }
        /**
         *设置渲染数据源
         * @param value
         */
        set dataSource(value) {
            this.removeAll();
            this._array = value || [];
            this.callLater(this.initItems);
        }
        get dataSource() {
            return this._array;
        }
        /**
         *初始化项
         *
         */
        initItems() {
            this.sumHeight = 0;
            var len = this._array.length;
            for (let i = 0; i < len; i++) {
                if (this._useInitBuff) { //缓冲初始
                    this.addItem(this._array[i]);
                }
                else {
                    this.addItemAt(this._array[i], i);
                }
            }
        }
        /*************************** 自动匹配内容差异优化 ******************************/
        compearArry(list) {
            var len = list.length;
            for (var i = len - 1; i >= 0; i--) {
                if (this._array.indexOf(list[i]) == -1)
                    continue;
                else
                    return i;
            }
            return len;
        }
        /**
         * @param list
         */
        inster(list) {
            var len = list.length;
            var tempIndex = this._itemCount;
            if (len == this._max)
                tempIndex = Math.min(this.compearArry(list), this._itemCount);
            for (var i = this._itemCount; i != len; i++) {
                this.addItemAt(list[i], i);
            }
        }
        /**
         *开始渲染缓冲列表
         *
         */
        beginBuffRender() {
            if (!this._buffing && this._buffList.length > 0) {
                this._buffing = true;
                Laya.timer.frameLoop(2, this, this.exeBuffRender);
            }
        }
        /**
         *渲染缓冲列表
         *
         */
        exeBuffRender() {
            if (!this._buffing)
                return;
            var speed = this._buffRenderSpeed;
            while (speed > 0) {
                speed--;
                this.addItemAt(this._buffList.shift(), this._itemCount);
                if (this._buffList.length <= 0) {
                    this.stopBuffRender();
                    return;
                }
            }
        }
        /**
         *停止缓冲渲染列表
         *
         */
        stopBuffRender() {
            this._buffing = false;
            Laya.timer.clear(this, this.exeBuffRender);
        }
        /**
         *清除缓冲渲染列表
         *
         */
        clearBuffRender() {
            this.stopBuffRender();
            this._buffList.splice(0, this._buffList.length);
        }
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        ///////////////////////////////////////////
        /**
         * 创建一个列表项 如果缓存列表里还有就从缓存列表里取 如果没有就重新创建一个
         * @return
         *
         */
        createItem() {
            var item;
            if (this._buffRenderList.length) {
                item = this._buffRenderList.pop();
            }
            else if (this._itemRender) {
                item = new this._itemRender();
            }
            if (item) {
                this._itemsParent.addChild(item);
                if (this._itemRenderWidth > 0) {
                    item.width = this._itemRenderWidth;
                }
            }
            item.y = this.sumHeight;
            item.x = 0;
            return item;
        }
        /**
         *移除所有项
         */
        removeAll() {
            while (this._itemCount > 0) {
                this.removeItemAt(0);
            }
            this.clearBuffRender();
            this.scrollBar.value = 0;
            this.scrollBar.max = 0;
            this.sumHeight = 0;
        }
        /**
         *
         * @param itemData
         *
         */
        removeItem(itemData) {
            var index = this._array.indexOf(itemData);
            if (index != -1)
                this.removeItemAt(index);
            else //查找是否在缓冲列表
                this._buffRenderList.splice(this._buffRenderList.indexOf(itemData), 1);
        }
        /**
         *删除列表项  并放入缓存列表里
         * @param index
         *
         */
        removeItemAt(index) {
            var item = this._items[index];
            if (item) {
                this._items.splice(index, 1);
                item.removeSelf();
                item.dataSource = null;
                this._buffRenderList.push(item);
                this._itemCount = this._items.length;
            }
        }
        /**
         * 添加项
         * @param itemData
         */
        addItem(itemData) {
            this._buffList.push(itemData);
            this.beginBuffRender();
        }
        /**
         *添加项到指定位置
         */
        addItemAt(itemData, index) {
            let layout = false;
            //如果列表已经达到最大值
            if (this._max > 0 && this._itemCount >= this._max) {
                this.removeItemAt(0);
                layout = true;
            }
            var value = Math.round(this._scrollBar.value);
            var item = this.createItem();
            item.dataSource = itemData;
            this.sumHeight += (item.height + this._spaceY);
            this.setItemVisiable(item);
            this._items.splice(index, 0, item);
            this._itemCount = this._items.length;
            if (layout) {
                this.callLater(this.layoutAllItem);
            }
            else {
                this.updateScrollMax();
            }
        }
        get cells() {
            return this._items;
        }
        getCell($index) {
            return this._items[$index];
        }
    }
    core.BuffRenderList = BuffRenderList;
})(core || (core = {}));
//# sourceMappingURL=BuffRenderList.js.map