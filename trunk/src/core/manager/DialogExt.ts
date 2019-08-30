/**
* name 
*/
module core {
	enum UI_DEPATH { BOTTOM, MIDDLE, TOP, GUIDE, LOADING, WAITING, ALERT }
	/** ui信息 */
	interface UIInfo {
		uiname: string;		// ui名称
		cls: any;				// ui逻辑类
		depth: UI_DEPATH;		// ui成绩
		atlases: string[];		// ui预加载资源数组
		destroyAtlases: string[];// 需要释放的资源数组
		popEffect: boolean;	// 是否打开特效
		isModal: boolean;		// 是否模态窗口
		closeOther: boolean;	// 是否关闭其他
		parentUI: string;		// 父类ui名称
		isQueue : boolean;		// 是否是队列弹窗
	}

	export class DialogExt extends Laya.Dialog {
		public dialogInfo: UIInfo;
		/** 是否点击遮罩关闭弹窗 */
		public isModelClose: boolean;
		/** 是否被忽略的dialog,不参与空白区域获取最上层dialog的检测 （如GuideMask.isIgnore=true,GuideMask用来挖空去关闭底下的窗口）*/
		public isIgnore : boolean;

		constructor() {
			super();
		}

		/**
		 * 关闭对话框。
		 * @param type 如果是点击默认关闭按钮触发，则传入关闭按钮的名字(name)，否则为null。
		 * @param showEffect 是否显示关闭效果
		 */
		public close(type?: string, showEffect?: boolean,sound?:boolean): void {
			showEffect = showEffect !== undefined ? showEffect  : (this.dialogInfo ? this.dialogInfo.popEffect : false);
			super.close(type, showEffect);
		}

		public popup(closeOther?: boolean, showEffect?: boolean):void {
			showEffect = showEffect !== undefined ? showEffect  : (this.dialogInfo ? this.dialogInfo.popEffect : false);
			super.popup(closeOther,showEffect);
			dispatchEvt(new common.GlobalEvent(common.GlobalEvent.DIALOG_CREATED, this));
		}

		public show(closeOther?: boolean, showEffect?: boolean):void {
			showEffect = showEffect !== undefined ? showEffect  : (this.dialogInfo ? this.dialogInfo.popEffect : false);
			super.show(closeOther,showEffect);
			dispatchEvt(new common.GlobalEvent(common.GlobalEvent.DIALOG_CREATED, this));
		}

		public onOpened(): void {
			super.onOpened();
			if(this.dialogInfo){
				ResUseMgr.useRes(this.dialogInfo.destroyAtlases);
			}
			dispatchEvt(new common.GlobalEvent(common.GlobalEvent.DIALOG_OPENED, this));
		}

		public onClosed(type?: string): void {
			super.onClosed(type);
			this.dataSource = null;
			this.scale(1,1);
			if(this.dialogInfo){
				ResUseMgr.releaseRes(this.dialogInfo.destroyAtlases);
				DialogQueueMgr.getInstance().pushNext(this.dialogInfo.uiname);
			}
			dispatchEvt(new common.GlobalEvent(common.GlobalEvent.DIALOG_CLOSED, this));
		}
	}
}