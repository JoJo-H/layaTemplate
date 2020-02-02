
module core {

    class EventManager {
        private _observerMap: Object = null;
        private _mediatorMap : Object = null;
        /** 模块 */
        private _modulemap: object = null;
        constructor() {
            this._observerMap = {};
            this._modulemap = {};
            this._mediatorMap = {};
        }

        /** 注册模块 -- 多个模块不能注册相同的mediator(唯一的),因为会执行相同的代码,可在mediator中注册相同的事件,再对事件做各自的处理 */
        registerModule(mdu: IModule): void {
            let name = mdu.getName();
            if (!name || name == "") {
                logerror("注册模块失败,没有模块名称",mdu);
                throw new Error("注册模块失败,没有模块名称");
            }
            this._modulemap[name] = mdu;
            this.registerMediators(mdu.listMediators());
            mdu.onRegister();
        }
        /** 注册多个mediator */
        public registerMediators(mediators:IMediator[]):void {
            if (mediators && mediators.length > 0) {
                for (var i = 0; i < mediators.length; i++) {
                    this.registerMediator(mediators[i]);
                }
            }
        }
        /** 注册单个mediator */
        public registerMediator(mediator:IMediator):void {
            let name = mediator.getName();
            if(!name || name == ""){
                logerror("mediator不能没有名称",mediator);
                throw new Error("mediator不能没有名称");
            }
            if(this._mediatorMap[name]) {
                logerror("不能注册两个相同的Mediator",mediator);
                throw new Error("不能注册两个相同的Mediator");
            }
            this._mediatorMap[name] = mediator;
            // 注册事件
            let events = mediator.listEvents();
            let len = events.length;
            if (len > 0) {
                let observer: IObserver = new Observer(mediator.handleNotification, mediator);
                for (let i = 0; i < len; i++) {
                    this.registerObserver(events[i], observer)
                }
            }
        }

        /** 注册事件观察 */
        registerObserver(notifyName: string, observer: IObserver): void {
            let observers: IObserver[] = this._observerMap[notifyName];
            if (observers && observers.length > 0) {
                if (!this.checkObserver(notifyName, observer.getNotifyContext())) {
                    observers.push(observer);
                    observers.sort((a: IObserver, b: IObserver) => {
                        return b.getPriority() - a.getPriority();
                    });
                } else {
                    logwarn('registerObserver重复注册:', notifyName)
                }
            } else {
                this._observerMap[notifyName] = [observer];
            }
        }

        /** 检测是否已注册事件观察 */
        checkObserver(notifyName: string, context: any): boolean {
            let observers: IObserver[] = this._observerMap[notifyName];
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
        notifyObservers(evt: IBaseEvent): void {
            let notifyName: string = evt.getName();
            let observers: IObserver[] = this._observerMap[notifyName];
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
        removeObserver(notifyName: string, context: any): void {
            let observers: IObserver[] = this._observerMap[notifyName];
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
        removeObserver2(notifyName: string,method:Function, context: any): void {
            let observers: IObserver[] = this._observerMap[notifyName];
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
        removeObserverByName(notifyName: string): void {
            this._observerMap[notifyName] = [];
        }
        /** 移除某个对象所有的事件观察 */
        removeObserverByContext(context: any): void {
            for (let notifyName in this._observerMap) {
                this.removeObserver(notifyName, context);
            }
        }
    }
    /** 添加事件 */
    export function addEvent(notifyName: string, method: Function, context: any, priority: number = 0): void {
        singleton(EventManager).registerObserver(notifyName, new Observer(method, context, priority));
    }
    /** 发送事件 */
    export function disptEvent(event:IBaseEvent): void {
        singleton(EventManager).notifyObservers(event);
    }
    /** 移除事件 */
    export function removeEvent(notifyName: string, context: any): void {
        singleton(EventManager).removeObserver(notifyName, context);
    }
    /** 移除事件 */
    export function removeEventMethod(notifyName: string,method:Function, context: any): void {
        singleton(EventManager).removeObserver2(notifyName,method, context);
    }
    /** 移除某个事件名称的所有事件观察 */
    export function removeEventByName(notifyName: string): void {
        singleton(EventManager).removeObserverByName(notifyName);
    }
    /** 移除某个对象所有的事件观察 */
    export function removeEventByContext(context: any): void {
        singleton(EventManager).removeObserverByContext(context);
    }
    /** 某个对象是否有该事件 */
    export function hasEvent(notifyName: string, context: any): boolean {
        return singleton(EventManager).checkObserver(notifyName, context);
    }
}