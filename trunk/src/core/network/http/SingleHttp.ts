
module core {

    export class SingleHttp {

        private _http: Laya.HttpRequest;
        /** 请求url */
        private _reqUrl:string;
        /** 请求参数 */
        private _parmData:Object;
        /** 回调自定义参数 */
        private _backArgs: any[];
        /** 成功回调函数 */
        private _requestSuccess: Function;
        /** 失败回调函数 */
        private _requestFail: Function;
        /** 重试次数 */
        private _tryTime : number;
        private _isFinish : boolean;
        constructor() {
            this._tryTime = 3;
            this._isFinish = false;
            this._http = new Laya.HttpRequest();
            this._http.http.timeout = 10000;//设置超时时间；
            this._http.http.responseType = "arraybuffer";
            this._http.on(Laya.Event.COMPLETE, this, this.completeHandler);
            this._http.on(Laya.Event.ERROR, this, this.errorHandler);
            // this._http.on(Laya.Event.PROGRESS, this, this.processHandler);
            // this._http.send("res/data.data", "", "get", "text");
            // this._http.send("http:xxx.xxx.com?a=xxxx&b=xxx", "", "get", "text");
            // this._http.send("http:xxx.xxx.com", "a=xxxx&b=xxx", "post", "text");
        }

        /**
         * 添加请求回调
         */
        addCallback(requestSuccess: Function = null, requestFail: Function = null) {
            this._requestSuccess = requestSuccess;
            this._requestFail = requestFail;
        }

        addBackArgs(backArgs: any[] = null) {
            this._backArgs = backArgs;
        }

        //请求登录
        send(url: string, data: any, method: string, contenttype?): void {
            if (this._tryTime > 0) {
                this._tryTime--;
                if (this._http) {
                    let ctype = contenttype ? contenttype : "application/x-www-form-urlencoded;charset=UTF-8";
                    let headers = ["Content-Type", ctype];
                    let parmStr = "";
                    if (is.object(data)) {
                        parmStr = this.parseParms(data)
                    } else {
                        parmStr = data;
                    }
                    if (method == "get") {
                        url += "/?" + parmStr;
                    }
                    this._http.send(url, (method == "get") ? "" : parmStr, method, "text", headers);
                }
            }
        }
        /** 解析参数 */
        private parseParms(object): string {
            let parms: string = "";
            for (var key in object) {
                parms += key + "=" + object[key] + "&";
            }
            return parms;
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
            }
            //todo
            this.requestClear();
        }

        /** 响应进度 */
        private processHandler(data: any): void {
            logdebug("requestProgress:",data);
        }

        /** 响应失败 */
        private errorHandler(event: Laya.Event): void {
            this.requestClear();
            core.showAlert({
                text: "获取数据失败，请稍后重试！", 
                confirmCb: () => {
                    
                }
            });
        }


        private requestClear(): void {
            this._isFinish = true;
            this._tryTime = 0;
            this._reqUrl = null;
            this._parmData = null;
            if (this._requestSuccess) {
                this._requestSuccess = null;
            }
            if (this._requestFail) {
                this._requestFail = null;
            }
            // this.clearHttp();
        }

        public isDone(): boolean {
            return this._isFinish;
        }
    }
}