/**
* name
*/
var core;
(function (core) {
    class DialogExt extends Laya.Dialog {
        constructor() {
            super();
        }
        onResize(e) {
            this.setSize(Laya.stage.width, Laya.stage.height);
        }
        /** 设置宽高 */
        setSize(w, h) {
            this.size(w, h);
        }
        /**
         * 关闭对话框。
         * @param type 如果是点击默认关闭按钮触发，则传入关闭按钮的名字(name)，否则为null。
         * @param showEffect 是否显示关闭效果
         */
        close(type, showEffect, sound) {
            showEffect = showEffect !== undefined ? showEffect : (this.dialogInfo ? this.dialogInfo.popEffect : false);
            super.close(type, showEffect);
        }
        popup(closeOther, showEffect) {
            showEffect = showEffect !== undefined ? showEffect : (this.dialogInfo ? this.dialogInfo.popEffect : false);
            super.popup(closeOther, showEffect);
            core.disptEvent(new core.DialogEvent(core.DialogEvent.DIALOG_CREATED, this));
        }
        show(closeOther, showEffect) {
            showEffect = showEffect !== undefined ? showEffect : (this.dialogInfo ? this.dialogInfo.popEffect : false);
            super.show(closeOther, showEffect);
            core.disptEvent(new core.DialogEvent(core.DialogEvent.DIALOG_CREATED, this));
        }
        onOpened() {
            super.onOpened();
            if (this.dialogInfo) {
                core.ResUseMgr.useRes(this.dialogInfo.destroyAtlases);
            }
            this.onStageResize();
            core.disptEvent(new core.DialogEvent(core.DialogEvent.DIALOG_OPENED, this));
        }
        onClosed(type) {
            super.onClosed(type);
            this.dataSource = null;
            this.scale(1, 1);
            if (this.dialogInfo) {
                core.ResUseMgr.releaseRes(this.dialogInfo.destroyAtlases);
                core.UIMgr.getInstance().closeDialog(this.dialogInfo.uiname);
            }
            this.onStageResize();
            core.disptEvent(new core.DialogEvent(core.DialogEvent.DIALOG_CLOSED, this));
        }
        /** 监听舞台宽高变化 */
        onStageResize() {
            if (this.listenStageResize) {
                if (!Laya.stage.hasListener(Laya.Event.RESIZE)) {
                    Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
                }
            }
            else {
                Laya.stage.off(Laya.Event.RESIZE, this, this.onResize);
            }
        }
    }
    core.DialogExt = DialogExt;
})(core || (core = {}));
//# sourceMappingURL=DialogExt.js.map