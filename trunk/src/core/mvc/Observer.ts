
module core {

    //实现观察者模式
    export class Observer implements IObserver{

        private _notifyMethod : Function = null;
        private _context : any = null;
        private _priority : number = 0;

        constructor(notifyMethod:Function,notifyContext:any,priority:number = 0){
            this.setNotifyMethod(notifyMethod);
            this.setNotifyContext(notifyContext);
            this.setPriority(priority);
        }

        getNotifyMethod():Function
        {
            return this._notifyMethod;
        }

        setNotifyMethod( notifyMethod:Function ):void
        {
            this._notifyMethod = notifyMethod;
        }
        
        getNotifyContext():any
        {
            return this._context;
        }
            
        setNotifyContext( notifyContext:any ):void
        {
            this._context = notifyContext;
        }

        getPriority():number{
            return this._priority;
        }
        setPriority(val:number):void{
            this._priority = val;
        }

        notifyObserver(evt:IBaseEvent):void{
            this.getNotifyMethod().call(this._context,evt);
        }
        /** 比较作用域this */
        compareContext(object:any):boolean {
            return this._context == object;
        }
        /** 比较方法 */
        compoareMethod(method:Function):boolean {
            return this._notifyMethod == method;
        }
    }
}