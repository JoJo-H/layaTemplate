
module core {

    export class NetConfig {

        /** 请求失败时的消息处理器类名 */
        public static requestMsgHandler : IMsgHandler;
        /** 同时能http请求的最大次数 0表示开启*/
        public static MAX_HTTP_COUNT : number = 0;
        /** 防止快速点击忽略列表 */
        public static ingoreList : string[] = [];

        public static httpUrl : string;


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