var core;
(function (core) {
    class WaitView extends core.DialogExt {
        constructor() {
            super();
            this._percent = 0;
            this.bgSpr = new Laya.Sprite();
            this.bgSpr.alpha = 0.3;
            this.addChild(this.bgSpr);
            // 画个转圈圈
            this.boxWaiting = new Laya.Box();
            this.boxWaiting.width = 100;
            this.boxWaiting.height = 100;
            this.addChild(this.boxWaiting);
            let radius = 50;
            let size = Math.sqrt(radius * radius / 2);
            let circleArr = [[radius, 0], [size, -size], [0, -radius], [-size, -size], [-radius, 0], [-size, size], [0, radius], [size, size]];
            this._alphaArr = [0.8, 0.7, 0.6, 0.55, 0.5, 0.5, 0.5, 0.5];
            this._circleArr = [];
            for (let i = 0; i < circleArr.length; i++) {
                let arr = circleArr[i];
                let spr = this.createCircle(arr[0], arr[1], 10, this._alphaArr[i]);
                this.boxWaiting.addChild(spr);
                this._circleArr.push(spr);
            }
            this.lbWait = new Laya.Label();
            this.lbWait.align = "center";
            this.lbWait.fontSize = 25;
            this.addChild(this.lbWait);
        }
        createCircle(cx, cy, radius, alpha) {
            let spr = new Laya.Sprite();
            spr.width = spr.height = 20;
            spr.x = cx - 10;
            spr.y = cy - 10;
            spr.alpha = alpha;
            spr.graphics.drawCircle(0, 0, radius, "#000000", "#000000", 2);
            return spr;
        }
        setSize(w, h) {
            super.setSize(w, h);
            // 背景
            this.bgSpr.width = w;
            this.bgSpr.height = h;
            this.bgSpr.graphics.clear();
            this.bgSpr.graphics.drawRect(0, 0, w, h, "#000000", "#000000", 2);
            this.lbWait.width = w - 100;
            this.lbWait.y = h / 2 + 200;
            this.boxWaiting.x = w / 2 - this.boxWaiting.width / 2;
            this.boxWaiting.y = h / 2 - this.boxWaiting.height / 2;
        }
        show(closeOther, showEffect) {
            super.show(closeOther, showEffect);
            this.initView();
        }
        popup(closeOther, showEffect) {
            super.popup(closeOther, showEffect);
            this.initView();
        }
        onClosed() {
            super.onClosed();
            Laya.timer.clearAll(this);
        }
        initView() {
            this.setLable();
            this._tempArr = [...this._circleArr];
            Laya.timer.frameLoop(3, this, this.animWait);
            this.animWait();
        }
        animWait() {
            let len = this._tempArr.length;
            for (let i = 0; i < len; i++) {
                this._tempArr[i].alpha = this._alphaArr[i];
            }
            let endSpr = this._tempArr.splice(len - 1, 1)[0];
            this._tempArr.unshift(endSpr);
        }
        setLable() {
            let text = core.is.string(this.dataSource) ? this.dataSource : "loading...{0}";
            this.lbWait.text = core.str.format(text, `${this._percent}%`);
        }
        /**
         * 更新进度 一个参数时为百分比,两个时为整数
         * @param value
         * @param total
         */
        updateProgress(value, total) {
            let percent = 0;
            if (total) {
                percent = Math.floor(value / total * 100);
            }
            else {
                percent = Math.floor(value * 100);
            }
            this._percent = percent;
            this.setLable();
        }
    }
    core.WaitView = WaitView;
})(core || (core = {}));
//# sourceMappingURL=WaitView.js.map