

class Launch {

    constructor(){
        Laya.init(core.API.SCENE_WIDTH, core.API.SCENE_HEIGHT, Laya.WebGL);
        if (Laya.Browser.onPC) {
            Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        }
        else {
            Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
        }
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.mouseThrough = true;
        Laya.stage.bgColor = "#000";
        Laya.SoundManager.autoStopMusic = false;
        Laya.SoundManager.useAudioMusic = false;
        Laya.loader.maxLoader = 1;
        //设置舞台宽高
        Laya.stage.setScreenSize(Laya.Browser.clientWidth * Laya.Browser.pixelRatio, Laya.Browser.clientHeight * Laya.Browser.pixelRatio);

        core.API.startRun();
        core.API.commonButtonSkin = "comp/button.png";
        core.API.commonButtonStateNum = 3;
        core.API.commonPanelSkin = "comp/bg.png";
        core.API.commonPanelSizeGrid = "30,4,4,4";
        // Laya.URL.basePath = "http://localhost:3333/layabox/layaTemplate/trunk/bin/";
        Laya.ResourceVersion.type = Laya.ResourceVersion.FILENAME_VERSION;
        //激活资源版本控制
        Laya.ResourceVersion.enable("version.json", Handler.create(this, this.beginLoad));
    }
    
    private beginLoad(){
        Laya.loader.load("ui.json", Handler.create(this, this.onLoadRes));
    }
    private onLoadRes(data): void {
        View.uiMap = data;
        Laya.loader.load("lang.json", Handler.create(this, this.onLoadJson));
        // Laya.loader.load(["res/atlas/comp.atlas","ui.json"], Handler.create(this, this.onStartGame));
    }
    private onLoadJson(data):void {
        console.log("---------",data);
        let obj = JSON.parse(data);
        console.log("---------",obj);
    }

    private onStartGame(): void {
        // core.registerUI(MainView,UIConst.MainView,null,null,core.UI_DEPATH_VALUE.BOTTOM,false,true,false,null,false,true)
        // core.showUI(UIConst.MainView);
    }
}