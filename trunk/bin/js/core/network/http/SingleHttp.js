var core;
(function (core) {
    class SingleHttp {
        constructor() {
            this.httpId = 0;
        }
        /** 初始化 */
        initHttp() {
            this._tryTime = 3;
            this._isFinish = false;
            this._maskFlag = false;
            this._hasWaiting = false;
            this._method = "get";
            this._responseType = "arraybuffer";
            if (!this._http) {
                this._http = new Laya.HttpRequest();
                this._http.http.timeout = 5000; //设置超时时间；
                this._http.http.responseType = this._responseType;
                if (core.is.fun(this._http.http.setRequestHeader)) {
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
        recovery() {
            if (core.is.fun(this._http.http.abort)) {
                this._http.http.abort();
            }
            this._http.offAll();
            this._http.http.ontimeout = null;
        }
        /** 清除 */
        clear() {
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
            core.network.recovery(this);
        }
        /**
         * 添加请求回调
         */
        addCallback(backArgs = null, requestSuccess = null, requestFail = null) {
            this._backArgs = backArgs;
            this._requestSuccess = requestSuccess;
            this._requestFail = requestFail;
        }
        /** 添加请求数据 */
        addData(reqUrl, data, showMask = true, method = "get", responseType = "arraybuffer") {
            this._reqUrl = reqUrl;
            this._parmData = data;
            this._maskFlag = showMask;
            this._method = method;
            this._responseType = responseType;
        }
        /** 发送请求 */
        send() {
            this._tryTime--;
            if (this._maskFlag) {
                // 一秒内有数据响应就不显示遮罩
                this._timeout = setTimeout(() => {
                    core.showWaiting();
                    this._hasWaiting = true;
                }, 1000);
            }
            let parmStr = "";
            if (core.is.object(this._parmData)) {
                parmStr = core.network.paramsToQueryString(this._parmData);
            }
            else {
                parmStr = this._parmData;
            }
            let url = this._reqUrl;
            if (this._method == "get") {
                url += "/?" + parmStr;
            }
            this._http.send(url, (this._method == "get") ? "" : parmStr, this._method, "text");
        }
        /** 响应成功 */
        completeHandler(event) {
            var response = this._http.data;
            if (response) {
                if (this._requestSuccess) {
                    if (this._backArgs) {
                        this._backArgs.unshift(response);
                        this._requestSuccess(this._backArgs);
                    }
                    else {
                        this._requestSuccess(response);
                    }
                }
            }
            else {
                core.logerror("completeHandler: data is null", this.httpId);
            }
            this.clear();
        }
        /** 响应失败 */
        errorHandler(event) {
            core.logerror("errorHandler:", this.httpId, event);
            this.tryAgain();
        }
        /** 超时处理 */
        timeoutHandler(data) {
            core.logerror("timeoutHandler:", this.httpId, data);
            this.tryAgain();
        }
        /** 重试 */
        tryAgain() {
            if (this._tryTime > 0) {
                //一秒后再重试
                this._tryTimeout = setTimeout(() => {
                    clearTimeout(this._tryTimeout);
                    this.send();
                }, 1000);
            }
            else {
                this.clear();
            }
        }
        /** 是否结束 */
        isFinish() {
            return this._isFinish;
        }
    }
    core.SingleHttp = SingleHttp;
})(core || (core = {}));
//# sourceMappingURL=SingleHttp.js.map