var core;
(function (core) {
    class network {
        /** 创建http */
        static createHttp() {
            let http;
            if (network._httpPool.length > 0) {
                http = network._httpPool.shift();
            }
            else {
                http = new core.SingleHttp();
                http.httpId = ++network._httpId;
            }
            http.initHttp();
            return http;
        }
        /** 回收http */
        static recovery(http) {
            http.recovery();
            network._httpPool.push(http);
        }
        /** 添加全局请求参数 */
        static addGlobalParams(key, params) {
            this._globalParams[key] = params;
        }
        /** 获取全局请求参数值 */
        static getGlobalParam(key) {
            return this._globalParams[key];
        }
        /** 移除全局请求参数 */
        static removeGlobalParams(key) {
            delete this._globalParams[key];
        }
        /** 将参数转换成url请求参数 */
        static paramsToQueryString(...args) {
            var params = [];
            for (var i = 0; i < args.length; i++) {
                var item = args[i];
                for (var key in item) {
                    params.push(key + "=" + item[key]);
                }
            }
            return params.join("&");
        }
    }
    /** SingleHttp的标识 */
    network._httpId = 0;
    /** 对象池 */
    network._httpPool = [];
    //默认的全局请求参数
    network._globalParams = {};
    core.network = network;
})(core || (core = {}));
//# sourceMappingURL=network.js.map