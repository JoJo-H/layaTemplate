

module core {
    /** 
     * 可折叠列表
    */
    export class Accordion extends BuffRenderList {


        constructor(width: number, height: number) {
            super(width, height, null);
            this.useInitBuff = false;
        }

        protected onCreate(): void {
            this.isAutoScroll = false;
            super.onCreate();
            core.addEvent(TreeEvent.SELECT_TAB, this.onSelect, this);
        }

        /** 选中标签展开内容 
         * 点击对象的name需要设置为clickTarget，并且事件类型为Click点击
         * 选中的这一项，如果是已展开的，则隐藏，否则展开内容
         * 未选中的执行onHide方法
        */
        protected onSelect(event:TreeEvent): void {
            let itemRender: Laya.Component = event.data;
            for (let i = 0, len = this._items.length; i < len; i++) {
                let box = this._items[i];
                if (box == itemRender) {
                    if (box['isShow'] && box['isShow']()) {
                        if (box['onHide']) {
                            box['onHide']();
                        }
                        break;
                    }
                    if (box['onShow']) {
                        box['onShow'](event.data);
                    }
                } else {
                    if (box['onHide']) {
                        box['onHide']();
                    }
                }
            }
            this.layoutAllItem();
        }

        public onRemove():void {
            super.onRemove();
            core.removeEventMethod(TreeEvent.SELECT_TAB, this.onSelect, this);
        }
    }

    export class TreeEvent extends BaseEvent{
        public static SELECT_TAB: string = 'TREE_SELECT_TAB';
        public data: any;

        constructor(type: string,data:any=null){
            super(type,data,"TreeEvent");
        }
    }

    /** Accordion的ItemRenderer需要实现的接口 */
    export interface IAccordionItemRenderer {
        onShow($data?): void;          //展开
        onHide(): void;          //隐藏
        isShow(): boolean;       //是否展开
    }
}