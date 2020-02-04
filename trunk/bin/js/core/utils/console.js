var core;
(function (core) {
    // 打印
    var getTimeShortStr = (v) => {
        return new Date(v).toTimeString();
    };
    function logcore(...args) {
        if (core.API.logLevel < 10)
            return;
        console.log(getTimeShortStr(Laya.timer.currTimer), ...args);
    }
    core.logcore = logcore;
    /**
     * @param args 打印错误
     */
    function logdebug(...args) {
        if (core.API.logLevel < 3)
            return;
        console.log(getTimeShortStr(Laya.timer.currTimer), ...args);
    }
    core.logdebug = logdebug;
    /**
     * @param args 打印错误
     */
    function logwarn(...args) {
        if (core.API.logLevel < 2)
            return;
        console.warn(getTimeShortStr(Laya.timer.currTimer), "[W]", ...args);
    }
    core.logwarn = logwarn;
    /**
     * @param args 打印提示
     */
    function logerror(...args) {
        if (core.API.logLevel < 1)
            return;
        console.error(getTimeShortStr(Laya.timer.currTimer), "[E]", ...args);
    }
    core.logerror = logerror;
})(core || (core = {}));
//# sourceMappingURL=console.js.map