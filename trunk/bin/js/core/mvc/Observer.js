var core;
(function (core) {
    //实现观察者模式
    class Observer {
        constructor(notifyMethod, notifyContext, priority = 0) {
            this._notifyMethod = null;
            this._context = null;
            this._priority = 0;
            this.setNotifyMethod(notifyMethod);
            this.setNotifyContext(notifyContext);
            this.setPriority(priority);
        }
        getNotifyMethod() {
            return this._notifyMethod;
        }
        setNotifyMethod(notifyMethod) {
            this._notifyMethod = notifyMethod;
        }
        getNotifyContext() {
            return this._context;
        }
        setNotifyContext(notifyContext) {
            this._context = notifyContext;
        }
        getPriority() {
            return this._priority;
        }
        setPriority(val) {
            this._priority = val;
        }
        notifyObserver(evt) {
            this.getNotifyMethod().call(this._context, evt);
        }
        /** 比较作用域this */
        compareContext(object) {
            return this._context == object;
        }
        /** 比较方法 */
        compoareMethod(method) {
            return this._notifyMethod == method;
        }
    }
    core.Observer = Observer;
})(core || (core = {}));
//# sourceMappingURL=Observer.js.map