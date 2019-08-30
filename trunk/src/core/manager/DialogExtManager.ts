module core {
    
    class DialogExtMgr extends Laya.DialogManager {

        constructor(){
            super();

            // 自定义遮罩关闭事件
            this.maskLayer.offAll();
            if(UIConfig.closeDialogOnSide) {
                this.maskLayer.on(Laya.Event.CLICK,this,this.closeOnSide)
            }
        }

        protected closeOnSide(event:Laya.Event):void {
            let dialog:Dialog = this.getTopModelDialog();
            if(dialog instanceof DialogExt) {
                if(dialog.isModelClose) {
                    dialog.close("side");
                }
            }else if (dialog instanceof Laya.Dialog && dialog.isModal){
                dialog.close("side");
            }
        }

        /** 获取最上层第一个正式（如非GuideMask,GuideMask用来挖空去关闭底下的窗口）的窗口 */
        private getTopModelDialog():Laya.Dialog {
            let len = this.numChildren;
            for(let i = len - 1 ; i >= 0 ; i--) {
                let dialog = this.getChildAt(i) as Laya.Dialog;
                if(dialog instanceof DialogExt && dialog.isIgnore){
                    continue;
                }
                return dialog;
            }
            return this.getChildAt(len - 1) as Laya.Dialog;
        }

        /**@private 发生层次改变后，重新检查遮罩层是否正确*/
		public _checkMask():void {
            // 重写_checkMask
            // _checkMask只在open与doclose的时候触发,但是当open时,还需要等重新排序childs,因为zOrder不同,所以maskLayer需要在zOrder最大的对象底下
            this.maskLayer.removeSelf();
            let len = this.numChildren;
            let maxZorder : number = -123456;
            for (let i:number = len - 1; i > -1; i--) {
				let dialog:Dialog = this.getChildAt(i) as Dialog;
				if (dialog && dialog.isModal && dialog.zOrder > maxZorder) {
					maxZorder = dialog.zOrder;
				}
			}
			for (let i:number = len - 1; i > -1; i--) {
				let dialog:Dialog = this.getChildAt(i) as Dialog;
                if(dialog && dialog.isModal && dialog.zOrder == maxZorder){
                    this.maskLayer.zOrder = dialog.zOrder;
                    this.addChildAt(this.maskLayer, i);
                    break;
                }
 			}
            
		}
    }
}