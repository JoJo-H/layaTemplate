
module core {

    export interface ILoadingView {
        dataSource:any;
        zOrder:number;
        updateProgress(value:number):void;
        updateProgress(count:number,total:number):void;

    }
}