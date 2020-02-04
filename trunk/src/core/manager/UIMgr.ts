
module core {
    import Sprite = Laya.Sprite;
    export enum UI_DEPATH_VALUE { BOTTOM = -20, MIDDLE = -10, TOP = 0, GUIDE = 20, LOADING = 30, WAITING = 40, ALERT = 41 }

    /** ui信息 */
    export interface UIInfo {
        uiname: string;		// ui名称
        cls: any;				// ui逻辑类
        depth: UI_DEPATH_VALUE;		// ui层级
        atlases: string[];		// ui预加载资源数组
        destroyAtlases: string[];// 需要释放的资源数组
        popEffect: boolean;	// 是否打开特效
        isModal: boolean;		// 是否模态窗口
        closeOther: boolean;	// 是否关闭其他
        parentUI: string;		// 父类ui名称
        isQueue: boolean;		// 是否是队列弹窗
        adaptStage: boolean;	// 适配舞台
    }
    export interface IDialogQueueVo {
        uiName: string;        // ui名称必须要，用于判断弹窗是否弹出
        dataSource?: any;
        args?: any;
    }

    export class UIMgr {
        public static _instance: UIMgr;

        public static getInstance(): UIMgr {
            if (!UIMgr._instance) {
                UIMgr._instance = new UIMgr();

            }
            return UIMgr._instance;
        }
        /** ui缓存 */
        private _uicache: any;
        /** ui注册 */
        private _uiregistMap: any;
        /** 队列弹窗 */
        private _queueList : IDialogQueueVo[];
        /** 当前队列弹窗ui名称 */
        private _curQueueUI : string;
        /** ui互斥组 */
        private _mutexGroupMap : any;
        constructor() {
            this._uiregistMap = {};
            this._uicache = {};
            this._queueList = [];
            this._mutexGroupMap = {};
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
        public registerUI(ui: any, uiname: string, atlases: Array<string>, destroyAtlases: Array<string>, depth: UI_DEPATH_VALUE, popEffect: boolean = false, isModal: boolean = false, closeOther: boolean = false, parentUI: string = null, isQueue: boolean = false, adaptStage: boolean = false): void {
            if (this._uiregistMap[uiname]) {
                logdebug("重复注册ui信息：",uiname);
            }
            let info: UIInfo = { uiname, cls: ui, atlases, depth, popEffect, isModal, closeOther, parentUI, destroyAtlases, isQueue, adaptStage };
            this._uiregistMap[uiname] = info;
        }

        /** 注册ui互斥组 */
        public registerGroupMutex(group:string,mutexGroup:string):void {
            this._mutexGroupMap[group] = mutexGroup;
        }
        
        /** 正在加载资源的ui */
        private _loadingResUi: string[] = [];
        /**显示ui */
        public showUI(uiName: string, dataSource?: any): void {
            //创建
            let uiinfo = this._uiregistMap[uiName] as UIInfo;
            if (!uiinfo) {
                logdebug("can not find ui name:", uiName);
                return;
            }
            // 是队列弹窗
            if (uiinfo.isQueue) {
                // 当前舞台有队列弹窗,插入队列等待
                if (this._curQueueUI) {
                    this._queueList.push({ uiName, dataSource })
                    return;
                } else {
                    this._curQueueUI = uiName;
                }
            }
            logdebug("showUI:", uiName);
            var self = this;
            let dialogExt: DialogExt = this._uicache[uiName];
            if (!dialogExt) {
                //如果需要预加载资源
                if (uiinfo.atlases || uiinfo.destroyAtlases) {
                    //开始加载ui
                    let atlases = (uiinfo.atlases || []).concat(uiinfo.destroyAtlases || []);
                    // 判断是否已在预加载,防止多次点击重复
                    if (this._loadingResUi.indexOf(uiName) == -1) {
                        this._loadingResUi.push(uiName);
                        showWaiting();
                        Laya.loader.load(atlases, Handler.create(null, ($dataSource: any, result) => { //加载完
                            // logyhj("加载结果：",result);
                            if (result === false) {
                                this.delLoadingUi(uiName);
                                //资源加载出错，就不打开界面
                                this.openDialogFail(uiName);
                                return;
                            }
                            hideWaiting();
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
                } else {
                    dialogExt = new uiinfo.cls();
                    if (uiinfo.adaptStage) {
                        dialogExt.setSize(Laya.stage.width, Laya.stage.height);
                    }
                    dialogExt.name = uiinfo.uiname;
                    dialogExt.dialogInfo = uiinfo;
                    this.catchCom(dialogExt, uiinfo, dataSource);
                }
            } else {
                this.catchCom(dialogExt, uiinfo, dataSource);
            }
        }
        /** 删除正在加载的ui */
        private delLoadingUi(uiname: string): void {
            let index = this._loadingResUi.indexOf(uiname);
            if (index != -1) {
                this._loadingResUi.splice(index, 1);
            }
        }
        /** 预加载资源失败后 */
        private openDialogFail(uiName:string):void {
            if (this._curQueueUI && this._curQueueUI === uiName) {
                this._curQueueUI = null;
                this.showQueueDialog();
            }
        }
        /** 打开下一个队列弹窗 */
        private showQueueDialog():void {
            if (this._queueList.length == 0 || this._curQueueUI) return;
            let vo = this._queueList.shift();
            // loghgy("显示弹窗：",vo.uiName);
            this.showUI(vo.uiName, vo.dataSource);
        }
        /** 关闭弹窗，判断是否需要弹出下一个弹窗 */
        public closeDialog(uiName:string):any {
            if(this._curQueueUI && this._curQueueUI === uiName) {
                // loghgy("关闭当前队列弹窗弹窗：",uiName);
                this._curQueueUI = null;
                this.showQueueDialog();
            }else{
                this.showQueueDialog();
            }
        }

        /** catchCom */
        private catchCom(dialog: DialogExt, uiinfo: UIInfo, dataSource: any) {
            //已经显示了，就不处理了
            if (dialog.parent) return; 
            //缓存
            if (!this._uicache.hasOwnProperty(uiinfo.uiname)) {
                this._uicache[uiinfo.uiname] = dialog;
            }
            dialog.dataSource = dataSource;
            dialog.isModal = uiinfo.isModal;
            // 关闭同组界面
            if (dialog.group) { 
                DialogExt.manager.closeByGroup(dialog.group);
            }
            /** 关闭互斥组界面 */
            if (this._mutexGroupMap.hasOwnProperty(dialog.group)) {
                DialogExt.manager.closeByGroup(this._mutexGroupMap[dialog.group]);
            }
            //如果有父面板，就先把父面板也开一下
            if (uiinfo.parentUI) { 
                this.showUI(uiinfo.parentUI);
            }
            dialog.zOrder = uiinfo.depth;
            if (uiinfo.isModal) {
                dialog.popup(uiinfo.closeOther, uiinfo.popEffect);
            }else {
                dialog.show(uiinfo.closeOther, uiinfo.popEffect);
            }
        }

        /**隐藏ui */
        public hideUIByName(uiname: string, showEffect?: boolean): void {
            let cui: DialogExt = this._uicache[uiname];
            if (cui && this.hasStage(uiname)) {
                logdebug(`hideUIByName:${uiname}`);
                cui.close("hideUIByName", showEffect, false);
            }
        }

        /**
         * 隐藏多个ui
         * @param depths 层级
         * @param excludes 排除的ui
         */
        public hideUIByDepth(depths: number[], excludes: string[] = []): void {
            for (let depth of depths) {
                let len = DialogExt.manager.numChildren;
                for (let i = len - 1; i >= 0; i--) {
                    let dialog : DialogExt = DialogExt.manager.getChildAt(i) as DialogExt;
                    if (dialog && dialog.zOrder == depth && excludes.indexOf(dialog.name) == -1 && is.fun(dialog.close)) {
                        dialog.close("hideUIByDepth", false, false);
                    }
                }
            }
        }
        /** 获取当前队列弹窗uiname */
        public getCudQueueUiName():string {
            return this._curQueueUI;
        }
        public hasQueueDialog():boolean {
            return this._curQueueUI ? true : false;
        }
        /** 获取ui信息 */
        public getUIInfo(uiname: string): UIInfo {
            return this._uiregistMap[uiname];
        }

        /**获取ui */
        public getUIByName(uiname: string): any {
            return this._uicache[uiname];
        }
        /**　是否在舞台 */
        public hasStage(uiname: string): boolean {
            let cui: Sprite = this._uicache[uiname];
            if (cui && cui.parent)
                return true;
            else
                return false;
        }
        /** 舞台上是否有该ui组 */
        public hasStageByGroup(uigroup: string): boolean {
            let group = DialogExt.manager.getDialogsByGroup(uigroup);
            return group && group.length > 0;
        }
        /** 清除ui缓存 */
        public clearUICache(): void {
            this._uicache = {};
        }

        /** 清除队列弹窗缓存 */
        public clearQueueMap():void {
            this._queueList.length = 0;
            this._curQueueUI = null;
        }
    }
    /** 注册ui */
    export function registerUI(ui: any, uiname: string, atlases: Array<string>, destroyAtlases: Array<string>, depth: UI_DEPATH_VALUE, popEffect: boolean = false, isModal: boolean = false, closeOther: boolean = false, parentUI: string = null, isQueue: boolean = false, adaptStage: boolean = false): void {
        UIMgr.getInstance().registerUI(ui, uiname,atlases,destroyAtlases,depth,popEffect,isModal,closeOther,parentUI,isQueue,adaptStage);
    }
    /** 显示ui */
    export function showUI(uiname: string, dataSource?: any, sound = true, preinit: boolean = false) {
        UIMgr.getInstance().showUI(uiname, dataSource);
    }
    /** 隐藏ui */
    export function hideUIByName(uiname: string, showEffect?: boolean): void {
        UIMgr.getInstance().hideUIByName(uiname, showEffect);
    }
    /** 隐藏ui */
    export function hideUIByDepth(depths: number[], excludes: string[] = []): void {
        UIMgr.getInstance().hideUIByDepth(depths, excludes);
    }
    /** 获取ui */
    export function getUIByName(uiname: string): any {
        return UIMgr.getInstance().getUIByName(uiname);
    }
    /** ui是否在舞台 */
    export function hasStage(uiname: string): boolean {
        return UIMgr.getInstance().hasStage(uiname);
    }
    /** 某个group的ui是否在舞台 */
    export function hasStageByGroup(uiname: string): boolean {
        return UIMgr.getInstance().hasStageByGroup(uiname);
    }
    /** 是否有队列弹窗 */
    export function hasQueueDialog(): boolean {
        return UIMgr.getInstance().hasQueueDialog();
    }
    /** 是否注册过ui */
    export function hasRegisterUI(uiname:string): boolean {
        return UIMgr.getInstance().getUIInfo(uiname) ? true : false;
    }
}