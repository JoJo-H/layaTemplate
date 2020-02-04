var core;
(function (core) {
    /**
     * 回调数据结构，提供this绑定功能
     */
    class Callback extends Object {
        /**
         * @param  {Function} callback
         * @param  {any} thisObj
         */
        constructor(callback, thisObj) {
            super();
            this.bindCallback = callback.bind(thisObj);
            this.callback = callback;
            this.thisObj = thisObj;
        }
    }
    core.Callback = Callback;
})(core || (core = {}));
//# sourceMappingURL=Callback.js.map