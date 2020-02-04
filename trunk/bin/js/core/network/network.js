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
    }
    network._httpId = 0;
    network._httpPool = [];
    core.network = network;
})(core || (core = {}));
//# sourceMappingURL=network.js.map