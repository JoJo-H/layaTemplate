
module core {

    export interface IBaseEvent {
        /** 事件类型 */
        type : any;
        /** 事件数据 */
        data : any;
        /** 获取事件名称 */
        getName():string;
    }

}