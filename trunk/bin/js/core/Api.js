var core;
(function (core) {
    class API {
        static startRun() {
            UIConfig.closeDialogOnSide = true;
            UIConfig.popupBgAlpha = 0.7;
            core.DialogExt.manager = new core.DialogExtMgr();
            core.DialogExt.manager.width = Laya.stage.width;
            core.DialogExt.manager.height = Laya.stage.height;
            core.DialogExt.manager.zOrder = 0;
            API.offsetX = (Laya.stage.width - API.SCENE_WIDTH) >> 1;
            API.offsetY = (Laya.stage.height - API.SCENE_HEIGHT) >> 1;
            core.NativeHttp;
        }
    }
    /** 越大表示打印等级越大,打印类型越多 1表示只打印error, 2表示打印error和warn, 3表示打印debug... */
    API.logLevel = 0;
    // 美术设计画布像素高宽
    API.SCENE_WIDTH = 720;
    API.SCENE_HEIGHT = 1280;
    API.offsetY = 0;
    API.offsetX = 0;
    core.API = API;
})(core || (core = {}));
//# sourceMappingURL=Api.js.map