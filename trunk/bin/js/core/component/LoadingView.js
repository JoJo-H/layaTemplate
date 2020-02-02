var core;
(function (core) {
    class LoadingView extends core.DialogExt {
        constructor() {
            super();
        }
        /** 显示加载动画 */
        showLoading() {
        }
        /** 隐藏加载动画 */
        hideLoading() {
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
    core.LoadingView = LoadingView;
})(core || (core = {}));
//# sourceMappingURL=LoadingView.js.map