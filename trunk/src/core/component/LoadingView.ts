
module core {

    export class LoadingView extends DialogExt implements ILoadingView{

        constructor(){
            super();
        }

        /** 显示加载动画 */
        showLoading():void{

        }

        /** 隐藏加载动画 */
        hideLoading():void{

        }

        /**
         * 更新进度 一个参数时为百分比,两个时为整数
         * @param value 
         * @param total 
         */ 
        updateProgress(value:number,total?:number):void{
            if(total){

            }else{

            }
        }
    }
}