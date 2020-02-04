

module core {

	/** 显示过场加载 */
	export function showLoading(text?: string): void {
		logdebug("showLoading...");
		if (!core.hasRegisterUI(ApiConst.LoadingView)) {
            let clz = API.loadingView || LoadingView;
			core.registerUI(clz,ApiConst.LoadingView,null,null,UI_DEPATH_VALUE.LOADING,false,true,false,null,false,true);
		}
		core.showUI(ApiConst.LoadingView,text);
	}

	/**
     * 加载进度 一个参数时为百分比,两个时为整数
     * @param value 
     * @param total 
     */ 
	export function loadingProcess(value: number,total?:number,text?: string): void {
		let loadingView = core.getUIByName(ApiConst.LoadingView) as ILoadingView;
		if (loadingView) {
			if (text) {
				loadingView.dataSource = text;
			}
			loadingView.updateProgress(value,total);
		}
	}

	/** 隐藏过场加载 */
	export function hideLoading() {
		logdebug("hideLoading...");
		core.hideUIByName(ApiConst.LoadingView);
		
	}

	/** 显示加载转圈 */
	export function showWaiting(text?: string): void {
		logdebug("showWaiting...");
		if (!core.hasRegisterUI(ApiConst.WaitView)) {
            let clz = API.waitView || WaitView;
			core.registerUI(clz,ApiConst.WaitView,null,null,UI_DEPATH_VALUE.WAITING,false,true,false,null,false,true);
		}
		core.showUI(ApiConst.WaitView,text);
	}

	/**
     * 加载进度 一个参数时为百分比,两个时为整数
     * @param value 
     * @param total 
     */ 
	export function waitingProgress(value: number,total?:number,text?: string): void {
		let waitView = core.getUIByName(ApiConst.WaitView) as IWaitView;
		if (waitView) {
			if (text) {
				waitView.dataSource = text;
			}
			waitView.updateProgress(value,total);
		}
	}

	/** 隐藏加载转圈 */
	export function hideWaiting() {
		logdebug("hideWaiting...");
		core.hideUIByName(ApiConst.WaitView);
	}

	/** 显示加载转圈 */
	export function showAlert(data: IAlertVo): void {
		if (!core.hasRegisterUI(ApiConst.AlertView)) {
            let clz = API.alertView || AlertView;
			core.registerUI(clz,ApiConst.AlertView,null,null,UI_DEPATH_VALUE.ALERT,true,true,false,null,false,false);
		}
		core.showUI(ApiConst.AlertView,data);
	}
}