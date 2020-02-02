

module core {

    declare var loadingView : ILoadingView;
	/**
	 * 显示过场加载
	 */
	export function showLoading(text?: string): void {
		logdebug("显示loading");
		if (!loadingView) {
            let clz = API.loadingView;
            if(clz){
                loadingView = new clz();
            }else{
                loadingView = new LoadingView();
            }
			loadingView.zOrder = UI_DEPATH_VALUE.LOADING;
		}
		if (text) {
			loadingView.dataSource = text;
		}
		loadingView.showLoading();
	}

	/**
     * 加载进度 一个参数时为百分比,两个时为整数
     * @param value 
     * @param total 
     */ 
	export function loadingProcess(value: number,total?:number,text?: string): void {
		if (loadingView) {
			if (text) {
				loadingView.dataSource = text;
			}
			loadingView.updateProgress(value,total);
		}
	}

	/**
	 * 隐藏过场加载
	 */
	export function hideLoading() {
		logdebug("隐藏load");
		if (loadingView) {
			loadingView.hideLoading();
		}
	}

	/**加载转圈 */
	declare var waitView: IWaitView;
	/** 显示加载转圈 */
	export function showWaiting(text?: string): void {
		if (!waitView) {
            let clz = API.waitView;
            if(clz){
                waitView = new clz();
            }else{
                waitView = new WaitView();
            }
			waitView.zOrder = UI_DEPATH_VALUE.WAITING;
		}
		if (text) {
			waitView.dataSource = text;
		}
		waitView.showWait();
	}

	/**
     * 加载进度 一个参数时为百分比,两个时为整数
     * @param value 
     * @param total 
     */ 
	export function waitingProgress(value: number,total?:number,text?: string): void {
		if (waitView) {
            if (text) {
				waitView.dataSource = text;
			}
			waitView.updateProgress(value,total);
		}
	}

	/** 隐藏加载转圈 */
	export function hideWaiting() {
		if (waitView) {
			waitView.hideWait();
		}
	}
}