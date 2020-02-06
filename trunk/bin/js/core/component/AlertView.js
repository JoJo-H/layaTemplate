var core;
(function (core) {
    /** 警告提示弹窗 */
    class AlertView extends core.DialogExt {
        constructor() {
            super();
            this.bgSpr = new Laya.Sprite();
            this.bgSpr.alpha = 0.8;
            this.addChild(this.bgSpr);
            this.setSize(400, 400);
        }
        setSize(w, h) {
            super.setSize(w, h);
            // 背景
            this.bgSpr.width = w;
            this.bgSpr.height = h;
            this.bgSpr.graphics.clear();
            this.bgSpr.graphics.drawRect(0, 0, w, h, "#000000", "#000000", 2);
        }
        createChildren() {
            super.createChildren();
            this.isModalClose = true;
            // 内容
            this._htmlText = new Laya.HTMLDivElement();
            this._htmlText.style.color = "#ffffff";
            this._htmlText.style.wordWrap = true;
            this._htmlText.mouseEnabled = false;
            this._htmlText.style.align = "center";
            this._htmlText.style.fontSize = 22;
            this._htmlText.style.leading = 15;
            this._htmlText.style.width = 300;
            this.addChild(this._htmlText);
            this._htmlText.y = 30;
            this._htmlText.x = 50;
            // 按钮
            this.btnYes = new Laya.Button();
            this.btnYes.width = 60;
            this.btnYes.height = 30;
            this.btnYes.anchorX = this.btnYes.anchorY = 0.5;
            this.btnYes.graphics.drawRect(0, 0, 60, 30, "#ffffff", "#000000", 2);
            this.addChild(this.btnYes);
            this.btnNot = new Laya.Button();
            this.btnNot.width = 60;
            this.btnNot.height = 30;
            this.btnNot.anchorX = this.btnNot.anchorY = 0.5;
            this.btnNot.graphics.drawRect(0, 0, 60, 30, "#ffffff", "#000000", 2);
            this.addChild(this.btnNot);
        }
        show(closeOther, showEffect) {
            this._alertVo = this.dataSource;
            this.initView();
            super.show(closeOther, showEffect);
        }
        popup(closeOther, showEffect) {
            this._alertVo = this.dataSource;
            this.initView();
            super.popup(closeOther, showEffect);
        }
        initView() {
            let info = this._alertVo;
            info.yes = info.yes ? info.yes : "确定";
            if (info.hasOwnProperty("no")) {
                info.no = info.no ? info.no : "取消";
            }
            this.btnNot.on(Laya.Event.CLICK, this, this.onCancel);
            this.btnYes.on(Laya.Event.CLICK, this, this.onConfirm);
            this.btnYes.label = info.yes;
            this.btnNot.label = info.no;
            this._htmlText.innerHTML = info.text;
            // 是否需要显示取消按钮
            if (info.no) {
                this.btnNot.visible = true;
                this.btnYes.x = this.width / 2 + 60;
                this.btnNot.x = this.width / 2 - 60;
            }
            else {
                this.btnNot.visible = false;
                this.btnYes.x = this.width / 2;
            }
            this.btnYes.y = this.btnNot.y = this._htmlText.y + this._htmlText.contextHeight + 70;
            let hg = this.btnYes.y + this.btnYes.height + 30;
            if (hg <= 300) {
                hg = 300;
            }
            this.height = this.bgSpr.height = hg;
            if (this.height - 70 >= this.btnYes.y) {
                this.btnYes.y = this.btnNot.y = this.height - 70;
            }
        }
        /** 确认回调 */
        onConfirm() {
            if (this._alertVo.confirmCb) {
                this._alertVo.confirmCb(this._alertVo.parm);
            }
            if (!this._alertVo.confirmNotClose) {
                this.toClose();
            }
        }
        /** 取消回调 */
        onCancel() {
            if (this._alertVo.cancelCb) {
                this._alertVo.cancelCb(this._alertVo.parm);
            }
            this.toClose();
        }
        toClose() {
            this.close();
        }
        onClosed() {
            super.onClosed();
            if (this._alertVo && this._alertVo.closeCb) {
                this._alertVo.closeCb();
            }
            this._alertVo = null;
            Laya.timer.clearAll(this);
            this.btnNot.off(Laya.Event.CLICK, this, this.onCancel);
            this.btnYes.off(Laya.Event.CLICK, this, this.onConfirm);
        }
    }
    core.AlertView = AlertView;
})(core || (core = {}));
//# sourceMappingURL=AlertView.js.map