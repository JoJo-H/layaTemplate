

module core {

    /** 防抖数据 */
    export interface IDebounce{
        key : string;   // 标识：便于存取,性能优化
        time : number;  // 防抖时间 毫秒
        caller : any;   // 执行域
        fun : Function; // 执行方法
        args : any;     // 参数
        isImmediate : boolean;

        timeout ?: number;
        lastTime ?: number;  // 上次执行时间
        packFunc ?: Function;    // 包装的方法
    }
    /** 
     *  防抖 -- 短时间内多次触发同一个事件，只执行最后一次，或者只在开始时执行，中间不执行。
    */
    export class debounce {
        /** 默认防抖时间 */
        static DEBOUNCE_TIME : number = 100;  

        /** 防抖对象 */
        private _debounceMap : {[key:string]:IDebounce} = {};     
        /**
         * 防抖
         * @param key 标识
         * @param caller 执行域
         * @param fun 执行方法
         * @param time 时间 毫秒
         * @param args 参数
         */
        on(key:string,caller:any,fun:Function,time?:number,isImmediate:boolean=false,args?:any):Function{
            if(this._debounceMap[key]) {
                return this._debounceMap[key].packFunc;
            }
            time = time > 0 ? time : debounce.DEBOUNCE_TIME;
            let info : IDebounce = {key,time,caller,fun,args,isImmediate,lastTime:0,packFunc:null};
            info.packFunc = ()=>{
                clearTimeout(info.timeout);
                // 立即执行时：在一段时间内不再执行；否则执行最后一次
                if(info.isImmediate){
                    let isTrigger = !info.timeout;
                    info.timeout = setTimeout(function(){
                        info.timeout = null;
                    }, info.time);
                    isTrigger&& info.fun.apply(info.caller,info.args);
                }else{
                    info.timeout = setTimeout(function(){
                        info.fun.apply(info.caller,info.args);   
                    },info.time);
                }
            }
            this._debounceMap[key] = info;
            return info.packFunc;

        }

        /** 释放 通过标识 */
        off(key:string):void {
            if(this._debounceMap[key]){
                this._debounceMap[key] = null;
                delete this._debounceMap[key];
            }
        }
        
        /** 释放 通过作用域 */
        offByCaller(caller:any):void {
            for(let key in this._debounceMap) {
                if(this._debounceMap[key].caller == caller){
                    this._debounceMap[key] = null;
                    delete this._debounceMap[key];
                    break;
                }
            }
        }

        /** 释放 通过方法 */
        offByFunc(caller:any,fun:Function):void {
            for(let key in this._debounceMap) {
                if(this._debounceMap[key].caller == caller && this._debounceMap[key].fun == fun){
                    this._debounceMap[key] = null;
                    delete this._debounceMap[key];
                    break;
                }
            }
        }

        /** 释放 通过包装的方法 */
        offByPackFunc(fun:Function):void {
            for(let key in this._debounceMap) {
                if(this._debounceMap[key].packFunc == fun){
                    this._debounceMap[key] = null;
                    delete this._debounceMap[key];
                    break;
                }
            }
        }
    
    }

    export function ondebounce(key:string,caller:any,fun:Function,time?:number,args?:any):Function {
        return singleton(debounce).on(key,caller,fun,time,args);
    }

    export function offdebounce(key:string):void {
        singleton(debounce).off(key);
    }
    
    export function offdebounce2(caller:any):void {
        singleton(debounce).offByCaller(caller);
    }

    export function offdebounce3(caller:any,fun:Function):void {
        singleton(debounce).offByFunc(caller,fun);
    }

    export function offdebounce4(packFun:Function):void {
        singleton(debounce).offByPackFunc(packFun);
    }
}