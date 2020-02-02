
module core {

    export interface IWaitView {
        dataSource:any;
        zOrder:number;
        showWait():void;
        hideWait():void;
        updateProgress(value:number):void;
        updateProgress(count:number,total:number):void;
    }
}