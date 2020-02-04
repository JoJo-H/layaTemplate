
module core {

    export class LoadingView extends DialogExt implements ILoadingView{

        public bgSpr : Laya.Sprite;
        public lbLoad : Laya.Label;
        private _percent : number;
        constructor(){
            super();
            this.bgSpr = new Laya.Sprite();
            this.bgSpr.alpha = 0.5;
            this.addChild(this.bgSpr);
            this.lbLoad = new Laya.Label();
            this.lbLoad.align = "center";
        }
        setSize(w,h):void {
            super.setSize(w,h);
            // 背景
            this.bgSpr.width = w;
            this.bgSpr.height = h;
            this.bgSpr.graphics.clear();
            this.bgSpr.graphics.drawRect(0,0,w,h,"#ffffff","#000000",2);
            this.lbLoad.width = w - 100;
            this.lbLoad.y = h/2 - 200;
        }

        show(closeOther?: boolean, showEffect?: boolean):void {
            super.show(closeOther,showEffect);
            this.initView();
        }

        popup(closeOther?: boolean, showEffect?: boolean):void {
            super.popup(closeOther,showEffect);
            this.initView();
        }

        private initView():void {
            let text = is.string(this.dataSource) ? this.dataSource : "loading...{0}";
            this.lbLoad.text = str.format(text,`${this._percent}%`);
        }

        /**
         * 更新进度 一个参数时为百分比,两个时为整数
         * @param value 
         * @param total 
         */ 
        updateProgress(value:number,total?:number):void{
            let percent = 0;
            if(total){
                percent = Math.floor(value/total*100);
            }else{
                percent = Math.floor(value*100);
            }
            this._percent = percent;
            this.initView();
        }
    }
}