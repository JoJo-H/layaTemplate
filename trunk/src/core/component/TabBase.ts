
module core {

    export class TabBase extends Laya.Tab implements ITabList{

        /**
         * 选择项时之前执行的验证处理器，(默认返回参数： 项索引（index:int）)。
         */
        public verifyHandler : Laya.Handler;
        public renderHandler : Laya.Handler;    // 勿用，用于可实现ITabList接口
        public mouseHandler : Laya.Handler;     // 勿用，用于可实现ITabList接口
        /** 选中后渲染前回调：可用于渲染之前的数据请求赋值等,比如请求后台数据 */
        public onSelectBefore?: (index:number,callback: Function) => void;
        constructor(){
            super();
        }

        public get selectedIndex():number {
            return this._selectedIndex;
        }

        /** 重写 */
        public set selectedIndex(value:number) {
            if(this._selectedIndex != value) {
                if(value == -1){
                    this.toSelect(value);
                    return;
                }
                // 验证不通过,不能选中
                if(this.verifyHandler && !this.verifyHandler.runWith(value)){
                    return;
                }
                if(this.onSelectBefore) {
                    this.onSelectBefore(value,this.toSelect.bind(this,value));
                }else{
                    this.toSelect(value);
                }
            }
        }

        private toSelect(value:number):void {
            this.setSelect(this._selectedIndex, false);
            this._selectedIndex = value;
            this.setSelect(value, true);
            this.event(Laya.Event.CHANGE);
            this.selectHandler && this.selectHandler.runWith(this._selectedIndex);
        }

    }
}