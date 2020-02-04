
module core {

    export interface IWaitView {
        dataSource:any;
        zOrder:number;
        updateProgress(value:number):void;
        updateProgress(count:number,total:number):void;
    }
}