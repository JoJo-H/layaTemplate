
module core {

    export class WaitView extends DialogExt implements IWaitView{

        constructor(){
            super();
        }
        /** 显示等待动画 */
        showWait():void {

        }

        /** 隐藏等待动画 */
        hideWait():void {
            
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