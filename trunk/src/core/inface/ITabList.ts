

module core {

    export interface ITabList extends Laya.EventDispatcher {

        selectedIndex: number;
        /**改变 <code>List</code> 的选择项时执行的处理器，(默认返回参数： 项索引（index:number）)。*/
        /**单元格渲染处理器(默认返回参数cell:Box,index:number)。*/
        renderHandler: Handler;
        /**单元格鼠标事件处理器(默认返回参数e:Event,index:number)。*/
        mouseHandler: Handler;
        selectHandler: Handler;
        /** 验证选择处理器(默认返回参数index:int) */
        verifyHandler?: Handler;
    }
}