module core {
    export class API {

        // ------------ 配置 ------------
        /** 越大表示打印等级越大,打印类型越多 1表示只打印error, 2表示打印error和warn, 3表示打印debug... */
        public static logLevel : number = 0;

        // ------------ UI配置 ------------
        /** 加载界面类名称: 实现ILoadingView的弹窗Dialog */
        public static loadingView : any;
        /** 等待界面类名称: 实现IWaitView的弹窗Dialog */
        public static waitView : any;
        /** 警告提示界面类名称: 实现IAlertView的弹窗Dialog */
        public static alertView : any;
        /** 通用按钮皮肤 */
        public static commonButtonSkin : string;
        public static commonButtonStateNum : number = 3;
        public static commonButtonSizeGrid : string;
        /** 通用背景图片皮肤 */
        public static commonPanelSkin : string;
        public static commonPanelSizeGrid : string;
        /** 请求失败时的消息处理器类名 */
        public static requestMsgHandler : IMsgHandler;
        // 美术设计画布像素高宽
        static SCENE_WIDTH: number = 720;
        static SCENE_HEIGHT: number = 1280;
        public static offsetY : number = 0;
        public static offsetX : number = 0;



        static startRun():void {
            UIConfig.closeDialogOnSide = true;
            UIConfig.popupBgAlpha = 0.7;
            DialogExt.manager = new DialogExtMgr();
            DialogExt.manager.width = Laya.stage.width;
            DialogExt.manager.height = Laya.stage.height;
            DialogExt.manager.zOrder = 0;

            API.offsetX = (Laya.stage.width - API.SCENE_WIDTH) >> 1;
            API.offsetY = (Laya.stage.height - API.SCENE_HEIGHT) >> 1;

        }
    }

    
}