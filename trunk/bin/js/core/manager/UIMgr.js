var core;
(function (core) {
    let UI_DEPATH_VALUE;
    (function (UI_DEPATH_VALUE) {
        UI_DEPATH_VALUE[UI_DEPATH_VALUE["BOTTOM"] = -20] = "BOTTOM";
        UI_DEPATH_VALUE[UI_DEPATH_VALUE["MIDDLE"] = -10] = "MIDDLE";
        UI_DEPATH_VALUE[UI_DEPATH_VALUE["TOP"] = 0] = "TOP";
        UI_DEPATH_VALUE[UI_DEPATH_VALUE["GUIDE"] = 20] = "GUIDE";
        UI_DEPATH_VALUE[UI_DEPATH_VALUE["LOADING"] = 30] = "LOADING";
        UI_DEPATH_VALUE[UI_DEPATH_VALUE["WAITING"] = 40] = "WAITING";
        UI_DEPATH_VALUE[UI_DEPATH_VALUE["ALERT"] = 41] = "ALERT";
    })(UI_DEPATH_VALUE = core.UI_DEPATH_VALUE || (core.UI_DEPATH_VALUE = {}));
    class UIMgr {
        constructor() {
            /** 正在加载资源的ui */
            this._loadingResUi = [];
            this._uiregistMap = {};
            this._uicache = {};
            this._queueList = [];
            this._mutexGroupMap = {};
        }
        static getInstance() {
            if (!UIMgr._instance) {
                UIMgr._instance = new UIMgr();
            }
            return UIMgr._instance;
        }
        /**
         * 注册ui
         * @param ui ui类名
         * @param uiname ui名称
         * @param atlases 预加载图集
         * @param destroyAtlases 关闭时需要销毁的图集(如大图)
         * @param depth 层级
         * @param popEffect 是否弹窗
         * @param isModal 是否模态
         * @param closeOther 是否关闭其他
         * @param parentUI 父
         * @param isQueue 是否序列弹窗
         * @param adaptStage 初始化时是否适配舞台尺寸
         */
        registerUI(ui, uiname, atlases, destroyAtlases, depth, popEffect = false, isModal = false, closeOther = false, parentUI = null, isQueue = false, adaptStage = false) {
            if (this._uiregistMap[uiname]) {
                core.logdebug("重复注册ui信息：", uiname);
            }
            let info = { uiname, cls: ui, atlases, depth, popEffect, isModal, closeOther, parentUI, destroyAtlases, isQueue, adaptStage };
            this._uiregistMap[uiname] = info;
        }
        /** 注册ui互斥组 */
        registerGroupMutex(group, mutexGroup) {
            this._mutexGroupMap[group] = mutexGroup;
        }
        /**显示ui */
        showUI(uiName, dataSource) {
            //创建
            let uiinfo = this._uiregistMap[uiName];
            if (!uiinfo) {
                core.logdebug("can not find ui name:", uiName);
                return;
            }
            // 是队列弹窗
            if (uiinfo.isQueue) {
                // 当前舞台有队列弹窗,插入队列等待
                if (this._curQueueUI) {
                    this._queueList.push({ uiName, dataSource });
                    return;
                }
                else {
                    this._curQueueUI = uiName;
                }
            }
            core.logdebug("showUI:", uiName);
            var self = this;
            let dialogExt = this._uicache[uiName];
            if (!dialogExt) {
                //如果需要预加载资源
                if (uiinfo.atlases || uiinfo.destroyAtlases) {
                    //开始加载ui
                    let atlases = (uiinfo.atlases || []).concat(uiinfo.destroyAtlases || []);
                    // 判断是否已在预加载,防止多次点击重复
                    if (this._loadingResUi.indexOf(uiName) == -1) {
                        this._loadingResUi.push(uiName);
                        core.showWaiting();
                        Laya.loader.load(atlases, Handler.create(null, ($dataSource, result) => {
                            // logyhj("加载结果：",result);
                            if (result === false) {
                                this.delLoadingUi(uiName);
                                //资源加载出错，就不打开界面
                                this.openDialogFail(uiName);
                                return;
                            }
                            core.hideWaiting();
                            this.delLoadingUi(uiName);
                            dialogExt = new uiinfo.cls();
                            if (uiinfo.adaptStage) {
                                dialogExt.setSize(Laya.stage.width, Laya.stage.height);
                            }
                            dialogExt.name = uiinfo.uiname;
                            dialogExt.dialogInfo = uiinfo;
                            this.catchCom(dialogExt, uiinfo, $dataSource);
                        }, [dataSource]));
                    }
                }
                else {
                    dialogExt = new uiinfo.cls();
                    if (uiinfo.adaptStage) {
                        dialogExt.setSize(Laya.stage.width, Laya.stage.height);
                    }
                    dialogExt.name = uiinfo.uiname;
                    dialogExt.dialogInfo = uiinfo;
                    this.catchCom(dialogExt, uiinfo, dataSource);
                }
            }
            else {
                this.catchCom(dialogExt, uiinfo, dataSource);
            }
        }
        /** 删除正在加载的ui */
        delLoadingUi(uiname) {
            let index = this._loadingResUi.indexOf(uiname);
            if (index != -1) {
                this._loadingResUi.splice(index, 1);
            }
        }
        /** 预加载资源失败后 */
        openDialogFail(uiName) {
            if (this._curQueueUI && this._curQueueUI === uiName) {
                this._curQueueUI = null;
                this.showQueueDialog();
            }
        }
        /** 打开下一个队列弹窗 */
        showQueueDialog() {
            if (this._queueList.length == 0 || this._curQueueUI)
                return;
            let vo = this._queueList.shift();
            // loghgy("显示弹窗：",vo.uiName);
            this.showUI(vo.uiName, vo.dataSource);
        }
        /** 关闭弹窗，判断是否需要弹出下一个弹窗 */
        closeDialog(uiName) {
            if (this._curQueueUI && this._curQueueUI === uiName) {
                // loghgy("关闭当前队列弹窗弹窗：",uiName);
                this._curQueueUI = null;
                this.showQueueDialog();
            }
            else {
                this.showQueueDialog();
            }
        }
        /** catchCom */
        catchCom(dialog, uiinfo, dataSource) {
            //已经显示了，就不处理了
            if (dialog.parent)
                return;
            //缓存
            if (!this._uicache.hasOwnProperty(uiinfo.uiname)) {
                this._uicache[uiinfo.uiname] = dialog;
            }
            dialog.dataSource = dataSource;
            dialog.isModal = uiinfo.isModal;
            // 关闭同组界面
            if (dialog.group) {
                core.DialogExt.manager.closeByGroup(dialog.group);
            }
            /** 关闭互斥组界面 */
            if (this._mutexGroupMap.hasOwnProperty(dialog.group)) {
                core.DialogExt.manager.closeByGroup(this._mutexGroupMap[dialog.group]);
            }
            //如果有父面板，就先把父面板也开一下
            if (uiinfo.parentUI) {
                this.showUI(uiinfo.parentUI);
            }
            dialog.zOrder = uiinfo.depth;
            if (uiinfo.isModal) {
                dialog.popup(uiinfo.closeOther, uiinfo.popEffect);
            }
            else {
                dialog.show(uiinfo.closeOther, uiinfo.popEffect);
            }
        }
        /**隐藏ui */
        hideUIByName(uiname, showEffect) {
            let cui = this._uicache[uiname];
            if (cui && this.hasStage(uiname)) {
                core.logdebug(`hideUIByName:${uiname}`);
                cui.close("hideUIByName", showEffect, false);
            }
        }
        /**
         * 隐藏多个ui
         * @param depths 层级
         * @param excludes 排除的ui
         */
        hideUIByDepth(depths, excludes = []) {
            for (let depth of depths) {
                let len = core.DialogExt.manager.numChildren;
                for (let i = len - 1; i >= 0; i--) {
                    let dialog = core.DialogExt.manager.getChildAt(i);
                    if (dialog && dialog.zOrder == depth && excludes.indexOf(dialog.name) == -1 && core.is.fun(dialog.close)) {
                        dialog.close("hideUIByDepth", false, false);
                    }
                }
            }
        }
        /** 获取当前队列弹窗uiname */
        getCudQueueUiName() {
            return this._curQueueUI;
        }
        hasQueueDialog() {
            return this._curQueueUI ? true : false;
        }
        /** 获取ui信息 */
        getUIInfo(uiname) {
            return this._uiregistMap[uiname];
        }
        /**获取ui */
        getUIByName(uiname) {
            return this._uicache[uiname];
        }
        /**　是否在舞台 */
        hasStage(uiname) {
            let cui = this._uicache[uiname];
            if (cui && cui.parent)
                return true;
            else
                return false;
        }
        /** 舞台上是否有该ui组 */
        hasStageByGroup(uigroup) {
            let group = core.DialogExt.manager.getDialogsByGroup(uigroup);
            return group && group.length > 0;
        }
        /** 清除ui缓存 */
        clearUICache() {
            this._uicache = {};
        }
        /** 清除队列弹窗缓存 */
        clearQueueMap() {
            this._queueList.length = 0;
            this._curQueueUI = null;
        }
    }
    core.UIMgr = UIMgr;
    /** 注册ui */
    function registerUI(ui, uiname, atlases, destroyAtlases, depth, popEffect = false, isModal = false, closeOther = false, parentUI = null, isQueue = false, adaptStage = false) {
        UIMgr.getInstance().registerUI(ui, uiname, atlases, destroyAtlases, depth, popEffect, isModal, closeOther, parentUI, isQueue, adaptStage);
    }
    core.registerUI = registerUI;
    /** 显示ui */
    function showUI(uiname, dataSource, sound = true, preinit = false) {
        UIMgr.getInstance().showUI(uiname, dataSource);
    }
    core.showUI = showUI;
    /** 隐藏ui */
    function hideUIByName(uiname, showEffect) {
        UIMgr.getInstance().hideUIByName(uiname, showEffect);
    }
    core.hideUIByName = hideUIByName;
    /** 隐藏ui */
    function hideUIByDepth(depths, excludes = []) {
        UIMgr.getInstance().hideUIByDepth(depths, excludes);
    }
    core.hideUIByDepth = hideUIByDepth;
    /** 获取ui */
    function getUIByName(uiname) {
        return UIMgr.getInstance().getUIByName(uiname);
    }
    core.getUIByName = getUIByName;
    /** ui是否在舞台 */
    function hasStage(uiname) {
        return UIMgr.getInstance().hasStage(uiname);
    }
    core.hasStage = hasStage;
    /** 某个group的ui是否在舞台 */
    function hasStageByGroup(uiname) {
        return UIMgr.getInstance().hasStageByGroup(uiname);
    }
    core.hasStageByGroup = hasStageByGroup;
    /** 是否有队列弹窗 */
    function hasQueueDialog() {
        return UIMgr.getInstance().hasQueueDialog();
    }
    core.hasQueueDialog = hasQueueDialog;
    /** 是否注册过ui */
    function hasRegisterUI(uiname) {
        return UIMgr.getInstance().getUIInfo(uiname) ? true : false;
    }
    core.hasRegisterUI = hasRegisterUI;
})(core || (core = {}));
//# sourceMappingURL=UIMgr.js.map