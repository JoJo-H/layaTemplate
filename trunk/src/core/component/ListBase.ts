
module core {

    export interface ITabList extends Laya.EventDispatcher {

        selectedIndex : number;
        /**改变 <code>List</code> 的选择项时执行的处理器，(默认返回参数： 项索引（index:number）)。*/
        /**单元格渲染处理器(默认返回参数cell:Box,index:number)。*/
        renderHandler: Handler;
        /**单元格鼠标事件处理器(默认返回参数e:Event,index:number)。*/
        mouseHandler: Handler;
        selectHandler : Handler;
        /** 验证选择处理器(默认返回参数index:int) */
        verifyHandler ?: Handler;
    }

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