
module core {


    /** http队列 */
    export class HttpQueueMgr {
        static TICK_KEY : string = "HttpQueueMgr_KEY";
        public static MAX_HTTP_COUNT: number = 3;
        /** http等待队列 */
        public _httpWaitList: SingleHttp[] = [];
        /** http当前执行队列 */
        private _curHttpList: SingleHttp[] = [];

        private static _instance : HttpQueueMgr;
        static getInstance():HttpQueueMgr{
            if(!this._instance){
                this._instance = new HttpQueueMgr();
            }
            return this._instance;
        }

        constructor() {
            // TimerMgr.instance.addKeyTick(HttpQueueMgr.TICK_KEY,this.update,this,)
        }

        /** 添加进队列 */
        public push(cmd: SingleHttp): void {
            this._httpWaitList.push(cmd);
            // window["pushCnt"] = window["pushCnt"] || 0;
            // loghgy("添加进队列",window["pushCnt"]++);
            this.update();
        }

        /** 刷新队列 */
        public update(): void {
            let len = this._curHttpList.length;
            // 清除已完成的HTTP请求
            if (len >= 0) {
                for (let i = len - 1; i >= 0; i--) {
                    let http: SingleHttp = this._curHttpList[i];
                    if (http.isFinish()) {
                        this._curHttpList.splice(i, 1);
                        // window["spliceCnt"] = window["spliceCnt"] || 0;
                        // loghgy("清除已完成的清除",window["spliceCnt"]++);
                    }
                }
            }
            len = this._curHttpList.length;
            // 网络请求不得多于3个
            if (len < HttpQueueMgr.MAX_HTTP_COUNT && this._httpWaitList.length > 0) {
                let http: SingleHttp = this._httpWaitList.shift();
                if (http) {
                    this._curHttpList.push(http);
                    http.send();
                    // window["sendCnt"] = window["sendCnt"] || 0;
                    // loghgy("执行请求",window["sendCnt"]++);
                }
            }
        }

        /** 清除队列 */
        public clear(): void {
            this._httpWaitList.length = 0;
            this._curHttpList.length = 0;
        }
    }
}