var core;
(function (core) {
    class WaitView extends core.DialogExt {
        constructor() {
            super();
        }
        /** 显示等待动画 */
        showWait() {
        }
        /** 隐藏等待动画 */
        hideWait() {
        }
        /**
         * 更新进度 一个参数时为百分比,两个时为整数
         * @param value
         * @param total
         */
        updateProgress(value, total) {
            if (total) {
            }
            else {
            }
        }
    }
    core.WaitView = WaitView;
})(core || (core = {}));
//# sourceMappingURL=WaitView.js.map