var core;
(function (core) {
    class API {
        startRun() {
            UIConfig.closeDialogOnSide = true;
            UIConfig.popupBgAlpha = 0.7;
            core.DialogExt.manager = new core.DialogExtMgr();
            core.DialogExt.manager.width = Laya.stage.width;
            core.DialogExt.manager.height = Laya.stage.height;
            core.DialogExt.manager.zOrder = 0;
        }
    }
    /** 越大表示打印等级越大,打印类型越多 1表示只打印error, 2表示打印error和warn, 3表示打印debug... */
    API.logLevel = 0;
    core.API = API;
})(core || (core = {}));
//# sourceMappingURL=Api.js.map