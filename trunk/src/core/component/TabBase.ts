
module core {

    export class TabBase extends Laya.Tab implements ITabList{

        public verifyHandler : Laya.Handler;
        public renderHandler : Laya.Handler;    // 勿用，用于可实现ITabList接口
        public mouseHandler : Laya.Handler;     // 勿用，用于可实现ITabList接口
        constructor(){
            super();
        }

        public get selectedIndex():number {
            return this._selectedIndex;
        }

        /** 重写 */
        public set selectedIndex(value:number) {
            if(this._selectedIndex != value) {
                // 验证不通过,不能选中
                if(this.verifyHandler && !this.verifyHandler.runWith(value)){
                    return;
                }
                this.setSelect(this._selectedIndex, false);
				this._selectedIndex = value;
				this.setSelect(value, true);
				this.event(Laya.Event.CHANGE);
				this.selectHandler && this.selectHandler.runWith(this._selectedIndex);
            }
        }

    }
}