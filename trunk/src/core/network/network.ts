
module core {

    export class network {
        /** SingleHttp的标识 */
        static _httpId : number = 0;

        /** 对象池 */
        static _httpPool : SingleHttp[] = [];
        /** 创建http */
        static createHttp():SingleHttp{
            let http : SingleHttp;
            if(network._httpPool.length > 0){
                http = network._httpPool.shift();
            }else{
                http = new SingleHttp();
                http.httpId = ++network._httpId;
            }
            http.initHttp();
            return http;
        }
        /** 回收http */
        static recovery(http:SingleHttp):void {
            http.recovery();
            network._httpPool.push(http);
        }

        //默认的全局请求参数
        public static _globalParams:any = {};
        /** 添加全局请求参数 */
        public static addGlobalParams(key:string, params:any):void {
            this._globalParams[key] = params;
        }
        /** 获取全局请求参数值 */
        public static getGlobalParam(key:string):any {
            return this._globalParams[key];
        }
        /** 移除全局请求参数 */
        public static removeGlobalParams(key:string): void {
            delete this._globalParams[key];
        }

        /** 将参数转换成url请求参数 */
        public static paramsToQueryString(...args):string {
            var params:Array<string> = [];
            for (var i:number = 0; i < args.length; i ++) {
                var item:Object = args[i];
                for (var key in item) {
                    params.push(key + "=" + item[key]);
                }
            }
            return params.join("&");
        }

        
    }
    
}