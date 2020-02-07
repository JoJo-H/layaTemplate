var core;
(function (core) {
    class LoadingView extends core.DialogExt {
        constructor() {
            super();
            this._percent = 0;
            this.bgSpr = new Laya.Sprite();
            this.bgSpr.alpha = 0.5;
            this.addChild(this.bgSpr);
            // 画个转圈圈
            this.boxWaiting = new Laya.Box();
            this.boxWaiting.width = 100;
            this.boxWaiting.height = 100;
            this.addChild(this.boxWaiting);
            let circleArr = [[0, 50], [50, 50], [100, 50]];
            this._circleArr = [];
            for (let i = 0; i < circleArr.length; i++) {
                let arr = circleArr[i];
                let spr = this.createCircle(arr[0], arr[1], 10, 1);
                this.boxWaiting.addChild(spr);
                this._circleArr.push(spr);
            }
            this.lbLoad = new Laya.Label();
            this.lbLoad.centerX = 0;
            this.lbLoad.fontSize = 25;
            this.addChild(this.lbLoad);
        }
        createCircle(cx, cy, radius, alpha) {
            let spr = new Laya.Sprite();
            spr.width = spr.height = 40;
            spr.graphics.drawCircle(spr.width / 2, spr.height / 2, radius, "#000000", "#000000", 2);
            spr.x = cx - spr.width / 2;
            spr.y = cy - spr.height / 2;
            spr.alpha = alpha;
            return spr;
        }
        setSize(w, h) {
            super.setSize(w, h);
            // 背景
            this.bgSpr.width = w;
            this.bgSpr.height = h;
            this.bgSpr.graphics.clear();
            this.bgSpr.graphics.drawRect(0, 0, w, h, "#000000", "#000000", 2);
            this.lbLoad.y = h / 2 + 100;
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
            this._count = 1;
            Laya.timer.loop(300, this, this.animWait);
            this.animWait();
        }
        animWait() {
            let len = this._circleArr.length;
            for (let i = 0; i < len; i++) {
                this._circleArr[i].visible = this._count > i;
            }
            this._count++;
            if (this._count > len) {
                this._count = 1;
            }
        }
        setLable() {
            let text = core.is.string(this.dataSource) ? this.dataSource : "loading...{0}";
            this.lbLoad.text = core.str.format(text, `${this._percent}%`);
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
    core.LoadingView = LoadingView;
})(core || (core = {}));
//# sourceMappingURL=LoadingView.js.map