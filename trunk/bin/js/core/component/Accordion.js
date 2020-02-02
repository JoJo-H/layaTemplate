var core;
(function (core) {
    /**
     * 可折叠列表
    */
    class Accordion extends core.BuffRenderList {
        constructor(width, height) {
            super(width, height, null);
            this.useInitBuff = false;
        }
        onCreate() {
            this.isAutoScroll = false;
            super.onCreate();
            core.addEvent(TreeEvent.SELECT_TAB, this.onSelect, this);
        }
        /** 选中标签展开内容
         * 点击对象的name需要设置为clickTarget，并且事件类型为Click点击
         * 选中的这一项，如果是已展开的，则隐藏，否则展开内容
         * 未选中的执行onHide方法
        */
        onSelect(event) {
            let itemRender = event.data;
            for (let i = 0, len = this._items.length; i < len; i++) {
                let box = this._items[i];
                if (box == itemRender) {
                    if (box['isShow'] && box['isShow']()) {
                        if (box['onHide']) {
                            box['onHide']();
                        }
                        break;
                    }
                    if (box['onShow']) {
                        box['onShow'](event.data);
                    }
                }
                else {
                    if (box['onHide']) {
                        box['onHide']();
                    }
                }
            }
            this.layoutAllItem();
        }
        onRemove() {
            super.onRemove();
            core.removeEventMethod(TreeEvent.SELECT_TAB, this.onSelect, this);
        }
    }
    core.Accordion = Accordion;
    class TreeEvent extends core.BaseEvent {
        constructor(type, data = null) {
            super(type, data, "TreeEvent");
        }
    }
    TreeEvent.SELECT_TAB = 'TREE_SELECT_TAB';
    core.TreeEvent = TreeEvent;
})(core || (core = {}));
//# sourceMappingURL=Accordion.js.map