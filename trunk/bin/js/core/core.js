var core;
(function (core) {
    /**
     * 显示过场加载
     */
    function showLoading(text) {
        core.logdebug("显示loading");
        if (!loadingView) {
            let clz = core.API.loadingView;
            if (clz) {
                loadingView = new clz();
            }
            else {
                loadingView = new core.LoadingView();
            }
            loadingView.zOrder = core.UI_DEPATH_VALUE.LOADING;
        }
        if (text) {
            loadingView.dataSource = text;
        }
        loadingView.showLoading();
    }
    core.showLoading = showLoading;
    /**
     * 加载进度 一个参数时为百分比,两个时为整数
     * @param value
     * @param total
     */
    function loadingProcess(value, total, text) {
        if (loadingView) {
            if (text) {
                loadingView.dataSource = text;
            }
            loadingView.updateProgress(value, total);
        }
    }
    core.loadingProcess = loadingProcess;
    /**
     * 隐藏过场加载
     */
    function hideLoading() {
        core.logdebug("隐藏load");
        if (loadingView) {
            loadingView.hideLoading();
        }
    }
    core.hideLoading = hideLoading;
    /** 显示加载转圈 */
    function showWaiting(text) {
        if (!waitView) {
            let clz = core.API.waitView;
            if (clz) {
                waitView = new clz();
            }
            else {
                waitView = new core.WaitView();
            }
            waitView.zOrder = core.UI_DEPATH_VALUE.WAITING;
        }
        if (text) {
            waitView.dataSource = text;
        }
        waitView.showWait();
    }
    core.showWaiting = showWaiting;
    /**
     * 加载进度 一个参数时为百分比,两个时为整数
     * @param value
     * @param total
     */
    function waitingProgress(value, total, text) {
        if (waitView) {
            if (text) {
                waitView.dataSource = text;
            }
            waitView.updateProgress(value, total);
        }
    }
    core.waitingProgress = waitingProgress;
    /** 隐藏加载转圈 */
    function hideWaiting() {
        if (waitView) {
            waitView.hideWait();
        }
    }
    core.hideWaiting = hideWaiting;
})(core || (core = {}));
//# sourceMappingURL=core.js.map