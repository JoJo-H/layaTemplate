
module core {
    export class ListBase extends Laya.List implements ITabList {

        public verifyHandler : Laya.Handler;
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
                this._selectedIndex = value;
				this.changeSelectStatus();
				this.event(Laya.Event.CHANGE);
				this.selectHandler && this.selectHandler.runWith(value);
				//选择发生变化，自动渲染一次
				this.startIndex = this._startIndex;
            }
        }

    }
}