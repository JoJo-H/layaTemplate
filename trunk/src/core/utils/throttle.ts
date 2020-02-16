

module core {

    /** 节流数据 */
    export interface IThrottle{
        key : string;   // 标识：便于存取,性能优化
        time : number;  // 节流时间 毫秒
        caller : any;   // 执行域
        fun : Function; // 执行方法
        args : any;     // 参数

        lastTime : number;  // 上次执行时间
        packFunc : Function;    // 包装的方法
    }
    /** 
     *  节流 -- 连续触发事件的过程中以一定时间间隔执行函数。节流会稀释你的执行频率，比如每间隔1秒钟，只会执行一次函数，无论这1秒钟内触发了多少次事件。
    */
    export class throttle {
        /** 默认节流时间 */
        static THROTTLE_TIME : number = 100;  

        /** 节流对象 */
        private _throttleMap : {[key:string]:IThrottle} = {};     
        /**
         * 节流
         * @param key 标识
         * @param caller 执行域
         * @param fun 执行方法
         * @param time 时间 毫秒
         * @param args 参数
         */
        on(key:string,caller:any,fun:Function,time?:number,args?:any):Function{
            if(this._throttleMap[key]) {
                return this._throttleMap[key].packFunc;
            }
            time = time > 0 ? time : throttle.THROTTLE_TIME;
            let info : IThrottle = {key,time,caller,fun,args,lastTime:0,packFunc:null};
            info.packFunc = ()=>{
                let now = +new Date();//将new date()转化为时间戳
                let lastTime = info.lastTime;
                if(now - lastTime > info.time){
                    info.fun.apply(info.caller,info.args);
                    info.lastTime = now;
                }
            }
            this._throttleMap[key] = info;
            return info.packFunc;
        }

        /** 释放 通过标识 */
        off(key:string):void {
            if(this._throttleMap[key]){
                this._throttleMap[key] = null;
                delete this._throttleMap[key];
            }
        }
        
        /** 释放 通过作用域 */
        offByCaller(caller:any):void {
            for(let key in this._throttleMap) {
                if(this._throttleMap[key].caller == caller){
                    this._throttleMap[key] = null;
                    delete this._throttleMap[key];
                    break;
                }
            }
        }

        /** 释放 通过方法 */
        offByFunc(caller:any,fun:Function):void {
            for(let key in this._throttleMap) {
                if(this._throttleMap[key].caller == caller && this._throttleMap[key].fun == fun){
                    this._throttleMap[key] = null;
                    delete this._throttleMap[key];
                    break;
                }
            }
        }
        
        /** 释放 通过包装的方法 */
        offByPackFunc(fun:Function):void {
            for(let key in this._throttleMap) {
                if(this._throttleMap[key].packFunc == fun){
                    this._throttleMap[key] = null;
                    delete this._throttleMap[key];
                    break;
                }
            }
        }
    }

    export function onThrottle(key:string,caller:any,fun:Function,time?:number,args?:any):Function {
        return singleton(throttle).on(key,caller,fun,time,args);
    }

    export function offThrottle(key:string):void {
        singleton(throttle).off(key);
    }
    
    export function offThrottle2(caller:any):void {
        singleton(throttle).offByCaller(caller);
    }

    export function offThrottle3(caller:any,fun:Function):void {
        singleton(throttle).offByFunc(caller,fun);
    }

    export function offThrottle4(packFun:Function):void {
        singleton(throttle).offByPackFunc(packFun);
    }
}