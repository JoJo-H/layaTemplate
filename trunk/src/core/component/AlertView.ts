
module core {
    /** 警告提示弹窗 */
    export class AlertView extends DialogExt implements IAlertView{

        private _alertVo : IAlertVo;
        private _htmlText: Laya.HTMLDivElement;
        public imgBg : Laya.Image;
        public btnNot:Laya.Button;
        public btnYes:Laya.Button;
        constructor(){
            super();
        }
        setSize(w,h):void {
            super.setSize(w,h);
            // 背景
            this.imgBg.width = w;
            this.imgBg.height = h;
            if(!this.imgBg.skin){
                this.imgBg.graphics.clear();
                this.imgBg.graphics.drawRect(0,0,w,h,"#ffffff","#000000",2);
            }
        }

        createChildren():void {
            super.createChildren();
            this.isModalClose = true;
            this.imgBg = new Laya.Image();
            if(API.commonPanelSkin){
                this.imgBg.skin = API.commonPanelSkin;
                this.imgBg.sizeGrid = API.commonPanelSizeGrid;
            }else{
                this.imgBg.alpha = 0.8;
            }
            this.addChild(this.imgBg);
            // 内容
            this._htmlText = new Laya.HTMLDivElement();
            this._htmlText.style.color = "#000000";
            this._htmlText.style.wordWrap = true;
            this._htmlText.mouseEnabled = false;
            this._htmlText.style.align = "center";
            this._htmlText.style.fontSize = 26;
            this._htmlText.style.leading = 15;
            this._htmlText.style.width = 300;
            this.addChild(this._htmlText);
            this._htmlText.y = 60;
            this._htmlText.x = 50;

            // 按钮
            this.btnYes = new Laya.Button();
            this.btnYes.labelColors = "#000000,#000000,#000000";
            this.btnYes.labelSize = 20;
            this.btnYes.width = 80;
            this.btnYes.height = 40;
            this.btnYes.anchorX = this.btnYes.anchorY = 0.5;
            if(API.commonButtonSkin){
                this.btnYes.skin = API.commonButtonSkin;
                this.btnYes.sizeGrid = API.commonButtonSizeGrid;
                this.btnYes.stateNum = API.commonButtonStateNum;
            }else{
                this.btnYes.graphics.drawRect(0,0,60,30,"#000000","#ffffff",4);
            }
            this.addChild(this.btnYes);

            this.btnNot = new Laya.Button();
            this.btnNot.labelColors = "#000000,#000000,#000000";
            this.btnNot.labelSize = 20;
            this.btnNot.width = 80;
            this.btnNot.height = 40;
            this.btnNot.anchorX = this.btnNot.anchorY = 0.5;
            if(API.commonButtonSkin){
                this.btnNot.skin = API.commonButtonSkin;
                this.btnNot.sizeGrid = API.commonButtonSizeGrid;
                this.btnNot.stateNum = API.commonButtonStateNum;
            }else{
                this.btnNot.graphics.drawRect(0,0,60,30,"#000000","#ffffff",4);
            }
            this.addChild(this.btnNot);
            this.setSize(400,400);
        }
        
        show(closeOther?: boolean, showEffect?: boolean):void {
            this._alertVo = this.dataSource;
            this.initView();
            super.show(closeOther,showEffect);
        }

        popup(closeOther?: boolean, showEffect?: boolean):void {
            this._alertVo = this.dataSource;
            this.initView();
            super.popup(closeOther,showEffect);
        }
        
        private initView():void {
            let info = this._alertVo;
            info.yes = info.yes ? info.yes : "确定";
            if(info.hasOwnProperty("no")){
                info.no = info.no ? info.no : "取消";
            }
            this.btnNot.on(Laya.Event.CLICK, this, this.onCancel);
            this.btnYes.on(Laya.Event.CLICK, this, this.onConfirm);
            this.btnYes.label = info.yes;
            this.btnNot.label = info.no;
            this._htmlText.innerHTML = info.text;
            // 是否需要显示取消按钮
            if (info.no) {
                this.btnNot.visible = true;
                this.btnYes.x = this.width/2 + 60;
                this.btnNot.x = this.width/2 - 60;
            } else {
                this.btnNot.visible = false;
                this.btnYes.x = this.width/2;
            }
            this.btnYes.y = this.btnNot.y = this._htmlText.y + this._htmlText.contextHeight + 70;
            
            let hg = this.btnYes.y + this.btnYes.height + 30;
            if(hg <= 300){
                hg = 300;
            }
            this.height = this.imgBg.height = hg;
            if(this.height - 70 >= this.btnYes.y){
                this.btnYes.y = this.btnNot.y = this.height - 70; 
            }
        }

        /** 确认回调 */
        private onConfirm(): void {
            if (this._alertVo.confirmCb) {
                this._alertVo.confirmCb(this._alertVo.parm);
            }
            if(!this._alertVo.confirmNotClose){
                this.toClose();
            }
        }

        /** 取消回调 */
        private onCancel(): void {
            if (this._alertVo.cancelCb) {
                this._alertVo.cancelCb(this._alertVo.parm);
            }
            this.toClose();
        }

        private toClose(): void {
            this.close();
        }

        public onClosed(): void {
            super.onClosed();
            if (this._alertVo && this._alertVo.closeCb) {
                this._alertVo.closeCb();
            }
            this._alertVo = null;
            Laya.timer.clearAll(this);
            this.btnNot.off(Laya.Event.CLICK, this, this.onCancel);
            this.btnYes.off(Laya.Event.CLICK, this, this.onConfirm);
        }
    }
}