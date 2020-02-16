var core;
(function (core) {
    class NetConfig {
    }
    /** 同时能http请求的最大次数 0表示开启*/
    NetConfig.MAX_HTTP_COUNT = 0;
    /** 防止快速点击忽略列表 */
    NetConfig.ingoreList = [];
    core.NetConfig = NetConfig;
})(core || (core = {}));
//# sourceMappingURL=NetConfig.js.map