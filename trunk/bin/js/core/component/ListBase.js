var core;
(function (core) {
    class ListBase extends Laya.List {
        constructor() {
            super();
        }
        get selectedIndex() {
            return this._selectedIndex;
        }
        /** 重写 */
        set selectedIndex(value) {
            if (this._selectedIndex != value) {
                // 验证不通过,不能选中
                if (this.verifyHandler && !this.verifyHandler.runWith(value)) {
                    return;
                }
                this._selectedIndex = value;
                this.changeSelectStatus();
                this.event(Laya.Event.CHANGE);
                this.selectHandler && this.selectHandler.runWith(value);
                //选择发生变化，自动渲染一次
                this.startIndex = this._startIndex;
            }
        }
    }
    core.ListBase = ListBase;
})(core || (core = {}));
//# sourceMappingURL=ListBase.js.map