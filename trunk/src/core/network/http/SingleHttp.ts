
module core {

    export class SingleHttp {
        public httpId : number = 0;

        private _http: Laya.HttpRequest;
        /** 请求url */
        private _reqUrl:string;
        /** 请求参数 */
        private _parmData:any;
        /** 回调自定义参数 */
        private _backArgs: any[];
        /** 成功回调函数 */
        private _requestSuccess: Function;
        /** 失败回调函数 */
        private _requestFail: Function;
        /** 重试次数 */
        private _tryTime : number;
        /** 是否需要遮罩 */
        private _maskFlag : boolean;
        /** 是否已完成请求 */
        private _isFinish : boolean;
        private _timeout : number;
        /** 是否在等待中 */
        private _hasWaiting : boolean;
        private _method : string;
        private _responseType : string;
        constructor() {
        }
        /** 初始化 */
        initHttp():void {
            this._tryTime = 3;
            this._isFinish = false;
            this._maskFlag = false;
            this._hasWaiting = false;
            this._method = "get";
            this._responseType = "arraybuffer";
            if(!this._http) {
                this._http = new Laya.HttpRequest();
                this._http.http.timeout = 5000;//设置超时时间；
                this._http.http.responseType = this._responseType;
                if(is.fun(this._http.http.setRequestHeader)){
                    this._http.http.setRequestHeader("Content-Type", "application/octet-stream;charset=UTF-8");
                }
            }
            this._http.on(Laya.Event.COMPLETE, this, this.completeHandler);
            this._http.on(Laya.Event.ERROR, this, this.errorHandler);
            this._http.http.ontimeout = this.timeoutHandler.bind(this);
            // this._http.send("res/data.data", "", "get", "text");
            // this._http.send("http:xxx.xxx.com?a=xxxx&b=xxx", "", "get", "text");
            // this._http.send("http:xxx.xxx.com", "a=xxxx&b=xxx", "post", "text");
        }
        /** 回收 */
        public recovery():void {
            if(is.fun(this._http.http.abort)){
                this._http.http.abort()
            }
            this._http.offAll();
            this._http.http.ontimeout = null;
        }

        /** 清除 */
        private clear(): void {
            this._isFinish = true;
            this._tryTime = 0;
            this._reqUrl = null;
            this._parmData = null;
            this._backArgs = null;
            if (this._requestSuccess) {
                this._requestSuccess = null;
            }
            if (this._requestFail) {
                this._requestFail = null;
            }
            if (this._hasWaiting) {
				core.hideWaiting();
				this._hasWaiting = false;
			}
            this._maskFlag = false;
            clearTimeout(this._timeout);
            clearTimeout(this._tryTimeout);
            HttpAPI.recovery(this);
            HttpQueueMgr.getInstance().update();
        }

        /**
         * 添加请求回调
         */
        addCallback(backArgs: any[] = null,requestSuccess: Function = null, requestFail: Function = null) {
            this._backArgs = backArgs;
            this._requestSuccess = requestSuccess;
            this._requestFail = requestFail;
        }
       
        /** 添加请求数据 */
        addData( reqUrl: string,data: any,showMask:boolean=true,method:string="get",responseType:string="arraybuffer"): void {
            this._reqUrl=reqUrl;
            this._parmData=data;
            this._maskFlag = showMask;
            this._method = method;
            this._responseType = responseType;
        }

        /** 发送请求 */
        send(): void {
            this._tryTime--;
			if (this._maskFlag) {
                // 一秒内有数据响应就不显示遮罩
				this._timeout = setTimeout(() => {
					core.showWaiting();
					this._hasWaiting = true;
				}, 1000);
			}
            let parmStr = "";
            if (is.object(this._parmData)) {
                parmStr = NetConfig.paramsToQueryString(this._parmData);
            } else {
                parmStr = this._parmData;
            }
            let url = this._reqUrl;
            if (this._method == "get") {
                url += "/?" + parmStr;
            }
            this._http.send(url, (this._method == "get") ? "" : parmStr, this._method, "text");
        }

        /** 响应成功 */
        private completeHandler(event: Laya.Event): void {
            var response = this._http.data;
            if (response) {
                if (this._requestSuccess) {
                    if (this._backArgs) {
                        this._backArgs.unshift(response);
                        this._requestSuccess(this._backArgs);
                    } else {
                        this._requestSuccess(response);
                    }
                }
            }else{
                logerror("completeHandler: data is null",this.httpId);
            }
            this.clear();
        }

        /** 响应失败 */
        private errorHandler(event: Laya.Event): void {
            logerror("errorHandler:",this.httpId,event);
            this.tryAgain();
        }

        /** 超时处理 */
        private timeoutHandler(data: any): void {
            logerror("timeoutHandler:",this.httpId,data);
            this.tryAgain();
        }

        private _tryTimeout : number;
        /** 重试 */
		private tryAgain(): void  {
			if (this._tryTime > 0) {
                //一秒后再重试
                this._tryTimeout = setTimeout(() => { 
                    clearTimeout(this._tryTimeout);
					this.send();
				}, 1000);
			}else {
                if (this._requestFail) {
                    this._requestFail(this._backArgs);
                }
				this.clear();
			}
		}

        /** 是否结束 */
        public isFinish(): boolean {
            return this._isFinish;
        }
    }
}