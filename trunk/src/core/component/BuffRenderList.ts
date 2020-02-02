
module core {

    /**
	 *缓冲渲染列表
	 * （1）.用于单帧渲染大量项
	 * （2）.用于大量数据列表第一次渲染时间较长
	 * @author xy015
	 *
	 */
    export class BuffRenderList extends Laya.Component implements Laya.IItem {
        private _itemRender: any;   //Class
        private _itemRenderWidth : number = 0;
        public _scrollBar: Laya.ScrollBar;
        private _itemsParent: Laya.Panel; //列表向的父级 所有的列表向都添加到 _itemsParent 而不是this  这样利于滚动管理
        private _array: any[];
        protected _items: Array<Laya.Component>;
        private _itemCount: number; //列表项的数
        //
        private _spaceX: number;
        private _spaceY: number;
        private _buffRenderList: any[]; //缓存itemrender的列表
        //
        private _isAutoScroll: Boolean = false; //是否自动调转到最底部
        private _scrollSize: number = 8;
        private _offset: number = 0;
        private _scrollWidth: number;
        private _scrollHeight: number;
        private _max: number; //列表最大显示数量
        /** 初始化时 是否缓存(分帧添加列表项) */
        private _useInitBuff: boolean = true;
        // 滚动变化回调函数 参数：滚动的value:number、是否向下滚动boolean
        private _scrollChangeHandler: Function;
        private _scrollChangeHandlerContext: any;

        /**
		 * 缓冲渲染列表
		 * @param width  宽度
		 * @param height 高度
		 * @param scrollBar 滚动条
		 * @param max 最大渲染数量
		 * @param buffRenderSpeed  渲染速度(单帧) 不宜设置过大
		 */
        public constructor(width: number, height: number, scrollBar: Laya.ScrollBar, max: number = 0, buffRenderSpeed: number = 2, useInitBuff: boolean = true) {
            super();
            this._scrollWidth = width;
            this._scrollHeight = height;
            // this._scrollBar = scrollBar;
            this._max = max;
            this._buffRenderSpeed = buffRenderSpeed;
            this._useInitBuff = useInitBuff;
            this.onCreate();
        }

        protected onCreate(): void {
            this._itemsParent = new Laya.Panel();
            this.addChildAt(this._itemsParent, 0);
            this._itemsParent.size(this._scrollWidth, this._scrollHeight);
            this._buffRenderList = [];
            this._items = new Array<Laya.Component>();

            this._itemsParent.vScrollBarSkin = "";
            this._scrollBar = this._itemsParent.vScrollBar;
            this._scrollBar.scrollSize = this._scrollSize;
            this._scrollBar.on(Laya.Event.CHANGE, this, this.onScrollBarChange);
            this.on(Laya.Event.MOUSE_WHEEL, this, this.onMouseWheel);
        }


        public stopScroll(){
            this._scrollBar.stopScroll();
        }

        public onRemove(): void {
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
        public layoutItem(item: Laya.Component, index: number): void {
            item.y = this.sumHeight;
            item.x = 0;
            this.sumHeight += (item.height + this._spaceY)
        }
        private sumHeight: number;

		/**
		 * 重新布局所有列表项的位置
		 *
		 */
        public layoutAllItem(): void {
            this.sumHeight = 0;
            for (var i: number = 0; i < this._itemCount; i++) {
                this.layoutItem(this._items[i], i);
            }
            this.onScrollBarChange();
            this.updateScrollMax();
        }

		/**
		 * 更新滚动条的最大值
		 *
		 */
        public updateScrollMax(): void {
            this.callLater(this.scrollToMax);
        }

		/**
		 *更新滚动条的最大值
		 */
        public scrollToMax(): void {
            var maxValue: number = (this.sumHeight > this._scrollHeight) ? this.sumHeight - (this._spaceY + this._scrollHeight) : 0;
            var isScroll: Boolean = true;
            if (this._scrollBar.value < this._scrollBar.max) {
                isScroll = false;
            }
            if (this._offset > maxValue) {
                this.offset = maxValue;
            }
            var $max: number = this._scrollBar.max;
            this._scrollBar.max = maxValue;
            if (this._isAutoScroll && isScroll) {
                this.setScrollBarValue(maxValue);
            }
        }

        public updateScrollMaxForce(): void {
            Laya.timer.frameOnce(4, this, this.scrollToMaxForce);
        }
        /**
		 *强制更新滚动条的最大值
		 */
        public scrollToMaxForce(): void {
            var maxValue: number = (this.sumHeight > this._scrollHeight) ? this.sumHeight - (this._spaceY + this._scrollHeight) : 0;
            if (this._offset > maxValue) {
                this.offset = maxValue;
            }
            this._scrollBar.max = maxValue;
            if (this._isAutoScroll) {
                this.setScrollBarValue(maxValue);
            }
        }

        /**在设置数据源时是否自动显示列表的最后一项*/
        public set isAutoScroll(value: Boolean) {
            this._isAutoScroll = value;
        }

        public get isAutoScroll(): Boolean {
            return this._isAutoScroll;
        }

        /**滚动条 一次滚动的量  这里是像素值*/
        public set scrollSize(value: number) {
            this._scrollSize = value;
        }

        /**Y方向项间隔*/
        public get spaceY(): number {
            return this._spaceY;
        }

        public set spaceY(value: number) {
            this._spaceY = value;
            this.callLater(this.layoutAllItem);
        }

        public get scrollBar(): Laya.ScrollBar {
            return this._scrollBar;
        }

        /**偏移量 坐标偏移*/
        public set offset(value: number) {
            if (this._offset == value)
                return;
            this._offset = value;
            this.refreshRender();
        }

		/**
		 * 刷新滚动的区域位置
		 *
		 */
        public refreshRender(): void {
            this.setScrollBarValue(this._offset);
        }

        /** value:Class */
        public set itemRender(value: any) {
            this._itemRender = value;
        }
        public get itemRender(): any {
            return this._itemRender;
        }
        public set itemRenderWidth(value: any) {
            this._itemRenderWidth = value;
        }

        public set max(value: number) {
            this._max = value;
        }

        public get max(): number {
            return this._max;
        }

        public set useInitBuff(value: boolean) {
            this._useInitBuff = value;
        }

        public get useInitBuff(): boolean {
            return this._useInitBuff;
        }

        setScrollChangeHandler(handler: Function, context: any): void {
            this._scrollChangeHandler = handler;
            this._scrollChangeHandlerContext = context;
        }

        public onScrollBarChange(): void {
            var value: number = Math.round(this._scrollBar.value);
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
        private setItemVisiable(item: Laya.Component) {
            var value: number = Math.round(this._scrollBar.value);
            let maxvalue = this._scrollHeight + value;
            if (item.y >= value && item.y <= maxvalue) {
                if (!item.visible) {
                    item.visible = true;
                }
            } else {
                if (item.y > value) {
                    if (item.visible) {
                        item.visible = false;
                    }
                } else {
                    let posy = value - item.y;
                    if (posy < item.height) {
                        if (!item.visible) {
                            item.visible = true;
                        }
                    } else {
                        if (item.visible) {
                            item.visible = false;
                        }
                    }
                }
            }
        }

        public onMouseWheel(e: Laya.Event): void {
            let value = this._scrollBar.value - (e.delta / Math.abs(e.delta)) * this._scrollSize;
            this.setScrollBarValue(value);
        }

        public setScrollBarValue(value: number): void {
            if (this._scrollChangeHandler) {
                this._scrollChangeHandler.apply(this._scrollChangeHandlerContext, [value, (value >= this._scrollBar.value ? true : false)]);
            }
            this._scrollBar.value = value;
        }

        public scrollBarTo(value: number) {
            Laya.timer.frameOnce(2, this, this.setScrollBarValue, [value]);
        }

		/**
		 *设置渲染数据源
		 * @param value
		 */
        public set dataSource(value) {
            this.removeAll();
            this._array = (value as Array<any>) || [];
            this.callLater(this.initItems);
        }

        public get dataSource() {
            return this._array;
        }

		/**
		 *初始化项
		 *
		 */
        public initItems(): void {
            this.sumHeight = 0;
            var len: number = this._array.length;
            for (let i = 0; i < len; i++) {
                if (this._useInitBuff) { //缓冲初始
                    this.addItem(this._array[i]);
                } else {
                    this.addItemAt(this._array[i], i);
                }
            }
        }

        /*************************** 自动匹配内容差异优化 ******************************/
        public compearArry(list: any[]): number {
            var len: number = list.length;
            for (var i: number = len - 1; i >= 0; i--) {
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
        public inster(list: any[]): void {
            var len: number = list.length;
            var tempIndex: number = this._itemCount;
            if (len == this._max)
                tempIndex = Math.min(this.compearArry(list), this._itemCount);
            for (var i: number = this._itemCount; i != len; i++) {
                this.addItemAt(list[i], i);
            }
        }


        /*************************** 缓冲渲染优化 ******************************/
		/**
		 * 缓冲渲染列表
		 */
        private _buffList: Array<Object> = new Array<Object>();
		/**
		 *缓冲渲染列表状态
		 */
        private _buffing: Boolean = false;
		/**
		 * 缓冲渲染速度(单位：项/每帧)
		 */
        private _buffRenderSpeed: number = 2;

		/**
		 *开始渲染缓冲列表
		 *
		 */
        public beginBuffRender(): void {
            if (!this._buffing && this._buffList.length > 0) {
                this._buffing = true;
                Laya.timer.frameLoop(2, this, this.exeBuffRender);
            }
        }

		/**
		 *渲染缓冲列表
		 *
		 */
        public exeBuffRender(): void {
            if (!this._buffing)
                return;
            var speed: number = this._buffRenderSpeed;
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
        public stopBuffRender(): void {
            this._buffing = false;
            Laya.timer.clear(this, this.exeBuffRender);
        }

		/**
		 *清除缓冲渲染列表
		 *
		 */
        public clearBuffRender(): void {
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
        public createItem(): Laya.Component {
            var item: Laya.Component;
            if (this._buffRenderList.length) {
                item = this._buffRenderList.pop();
            } else if (this._itemRender) {
                item = new this._itemRender();
            }
            if (item) {
                this._itemsParent.addChild(item);
                if(this._itemRenderWidth > 0){
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
        public removeAll(): void {
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
        public removeItem(itemData: Object): void {
            var index: number = this._array.indexOf(itemData);
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
        public removeItemAt(index: number): void {
            var item: Laya.Component = this._items[index] as Laya.Component;
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
        public addItem(itemData: Object): void {
            this._buffList.push(itemData);
            this.beginBuffRender();
        }

		/**
		 *添加项到指定位置
		 */
        private addItemAt(itemData: Object, index: number): void {
            let layout = false;
            //如果列表已经达到最大值
            if (this._max > 0 && this._itemCount >= this._max) {
                this.removeItemAt(0);
                layout = true;
            }
            var value: number = Math.round(this._scrollBar.value);
            var item: Laya.Component = this.createItem();
            item.dataSource = itemData;
            this.sumHeight += (item.height + this._spaceY)
            this.setItemVisiable(item);
            this._items.splice(index, 0, item);
            this._itemCount = this._items.length;
            if(layout){
                this.callLater(this.layoutAllItem);
            }else{
                this.updateScrollMax();
            }
        }

        public get cells(): Array<Laya.Component> {
            return this._items;
        }

        public getCell($index: number): Laya.Component {
            return this._items[$index];
        }
    }
}