var core;
(function (core) {
    class EventManager {
        constructor() {
            this._observerMap = null;
            this._mediatorMap = null;
            /** 模块 */
            this._modulemap = null;
            this._observerMap = {};
            this._modulemap = {};
            this._mediatorMap = {};
        }
        /** 注册模块 -- 多个模块不能注册相同的mediator(唯一的),因为会执行相同的代码,可在mediator中注册相同的事件,再对事件做各自的处理 */
        registerModule(mdu) {
            let name = mdu.getName();
            if (!name || name == "") {
                core.logerror("注册模块失败,没有模块名称", mdu);
                throw new Error("注册模块失败,没有模块名称");
            }
            this._modulemap[name] = mdu;
            this.registerMediators(mdu.listMediators());
            mdu.onRegister();
        }
        /** 注册多个mediator */
        registerMediators(mediators) {
            if (mediators && mediators.length > 0) {
                for (var i = 0; i < mediators.length; i++) {
                    this.registerMediator(mediators[i]);
                }
            }
        }
        /** 注册单个mediator */
        registerMediator(mediator) {
            let name = mediator.getName();
            if (!name || name == "") {
                core.logerror("mediator不能没有名称", mediator);
                throw new Error("mediator不能没有名称");
            }
            if (this._mediatorMap[name]) {
                core.logerror("不能注册两个相同的Mediator", mediator);
                throw new Error("不能注册两个相同的Mediator");
            }
            this._mediatorMap[name] = mediator;
            // 注册事件
            let events = mediator.listEvents();
            let len = events.length;
            if (len > 0) {
                let observer = new core.Observer(mediator.handleNotification, mediator);
                for (let i = 0; i < len; i++) {
                    this.registerObserver(events[i], observer);
                }
            }
        }
        /** 注册事件观察 */
        registerObserver(notifyName, observer) {
            let observers = this._observerMap[notifyName];
            if (observers && observers.length > 0) {
                if (!this.checkObserver(notifyName, observer.getNotifyContext())) {
                    observers.push(observer);
                    observers.sort((a, b) => {
                        return b.getPriority() - a.getPriority();
                    });
                }
                else {
                    core.logwarn('registerObserver重复注册:', notifyName);
                }
            }
            else {
                this._observerMap[notifyName] = [observer];
            }
        }
        /** 检测是否已注册事件观察 */
        checkObserver(notifyName, context) {
            let observers = this._observerMap[notifyName];
            let len = observers.length;
            for (let i = 0; i < len; i++) {
                let observer = observers[i];
                if (observer.compareContext(context)) {
                    return true;
                }
            }
            return false;
        }
        /** 通知观察者执行 */
        notifyObservers(evt) {
            let notifyName = evt.getName();
            let observers = this._observerMap[notifyName];
            if (observers) {
                //copy
                let observersCopy = observers.slice(0);
                let len = observersCopy.length;
                for (let i = 0; i < len; i++) {
                    let observer = observersCopy[i];
                    observer.notifyObserver(evt);
                }
            }
        }
        /** 移除事件观察 */
        removeObserver(notifyName, context) {
            let observers = this._observerMap[notifyName];
            if (observers) {
                let i = observers.length;
                while (i--) {
                    let observer = observers[i];
                    if (observer.compareContext(context)) {
                        observers.splice(i, 1);
                        break;
                    }
                }
            }
        }
        removeObserver2(notifyName, method, context) {
            let observers = this._observerMap[notifyName];
            if (observers) {
                let i = observers.length;
                while (i--) {
                    let observer = observers[i];
                    if (observer.compareContext(context)) {
                        observers.splice(i, 1);
                        break;
                    }
                }
            }
        }
        /** 移除某个事件名称的所有事件观察 */
        removeObserverByName(notifyName) {
            this._observerMap[notifyName] = [];
        }
        /** 移除某个对象所有的事件观察 */
        removeObserverByContext(context) {
            for (let notifyName in this._observerMap) {
                this.removeObserver(notifyName, context);
            }
        }
    }
    /** 添加事件 */
    function addEvent(notifyName, method, context, priority = 0) {
        core.singleton(EventManager).registerObserver(notifyName, new core.Observer(method, context, priority));
    }
    core.addEvent = addEvent;
    /** 发送事件 */
    function disptEvent(event) {
        core.singleton(EventManager).notifyObservers(event);
    }
    core.disptEvent = disptEvent;
    /** 移除事件 */
    function removeEvent(notifyName, context) {
        core.singleton(EventManager).removeObserver(notifyName, context);
    }
    core.removeEvent = removeEvent;
    /** 移除事件 */
    function removeEventMethod(notifyName, method, context) {
        core.singleton(EventManager).removeObserver2(notifyName, method, context);
    }
    core.removeEventMethod = removeEventMethod;
    /** 移除某个事件名称的所有事件观察 */
    function removeEventByName(notifyName) {
        core.singleton(EventManager).removeObserverByName(notifyName);
    }
    core.removeEventByName = removeEventByName;
    /** 移除某个对象所有的事件观察 */
    function removeEventByContext(context) {
        core.singleton(EventManager).removeObserverByContext(context);
    }
    core.removeEventByContext = removeEventByContext;
    /** 某个对象是否有该事件 */
    function hasEvent(notifyName, context) {
        return core.singleton(EventManager).checkObserver(notifyName, context);
    }
    core.hasEvent = hasEvent;
})(core || (core = {}));
//# sourceMappingURL=EventManager.js.map