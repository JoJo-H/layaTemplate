var core;
(function (core) {
    /** 显示过场加载 */
    function showLoading(text) {
        core.logdebug("showLoading...");
        if (!core.hasRegisterUI(core.ApiConst.LoadingView)) {
            let clz = core.API.loadingView || core.LoadingView;
            core.registerUI(clz, core.ApiConst.LoadingView, null, null, core.UI_DEPATH_VALUE.LOADING, false, true, false, null, false, true);
        }
        core.showUI(core.ApiConst.LoadingView, text);
    }
    core.showLoading = showLoading;
    /**
     * 加载进度 一个参数时为百分比,两个时为整数
     * @param value
     * @param total
     */
    function loadingProcess(value, total, text) {
        let loadingView = core.getUIByName(core.ApiConst.LoadingView);
        if (loadingView) {
            if (text) {
                loadingView.dataSource = text;
            }
            loadingView.updateProgress(value, total);
        }
    }
    core.loadingProcess = loadingProcess;
    /** 隐藏过场加载 */
    function hideLoading() {
        core.logdebug("hideLoading...");
        core.hideUIByName(core.ApiConst.LoadingView);
    }
    core.hideLoading = hideLoading;
    /** 显示加载转圈 */
    function showWaiting(text) {
        core.logdebug("showWaiting...");
        if (!core.hasRegisterUI(core.ApiConst.WaitView)) {
            let clz = core.API.waitView || core.WaitView;
            core.registerUI(clz, core.ApiConst.WaitView, null, null, core.UI_DEPATH_VALUE.WAITING, false, true, false, null, false, true);
        }
        core.showUI(core.ApiConst.WaitView, text);
    }
    core.showWaiting = showWaiting;
    /**
     * 加载进度 一个参数时为百分比,两个时为整数
     * @param value
     * @param total
     */
    function waitingProgress(value, total, text) {
        let waitView = core.getUIByName(core.ApiConst.WaitView);
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
        core.logdebug("hideWaiting...");
        core.hideUIByName(core.ApiConst.WaitView);
    }
    core.hideWaiting = hideWaiting;
    /** 显示加载转圈 */
    function showAlert(data) {
        if (!core.hasRegisterUI(core.ApiConst.AlertView)) {
            let clz = core.API.alertView || core.AlertView;
            core.registerUI(clz, core.ApiConst.AlertView, null, null, core.UI_DEPATH_VALUE.ALERT, true, true, false, null, false, false);
        }
        core.showUI(core.ApiConst.AlertView, data);
    }
    core.showAlert = showAlert;
})(core || (core = {}));
//# sourceMappingURL=core.js.map