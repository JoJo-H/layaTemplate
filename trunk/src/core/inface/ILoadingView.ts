
module core {

    export interface ILoadingView {
        dataSource:any;
        zOrder:number;
        showLoading():void;
        hideLoading():void;
        updateProgress(value:number):void;
        updateProgress(count:number,total:number):void;

    }
}