var core;
(function (core) {
    class TabBase extends Laya.Tab {
        constructor() {
            super();
        }
        get selectedIndex() {
            return this._selectedIndex;
        }
        /** 重写 */
        set selectedIndex(value) {
            if (this._selectedIndex != value) {
                if (value == -1) {
                    this.toSelect(value);
                    return;
                }
                // 验证不通过,不能选中
                if (this.verifyHandler && !this.verifyHandler.runWith(value)) {
                    return;
                }
                if (this.onSelectBefore) {
                    this.onSelectBefore(value, this.toSelect.bind(this, value));
                }
                else {
                    this.toSelect(value);
                }
            }
        }
        toSelect(value) {
            this.setSelect(this._selectedIndex, false);
            this._selectedIndex = value;
            this.setSelect(value, true);
            this.event(Laya.Event.CHANGE);
            this.selectHandler && this.selectHandler.runWith(this._selectedIndex);
        }
    }
    core.TabBase = TabBase;
})(core || (core = {}));
//# sourceMappingURL=TabBase.js.map