
module core {

    export class NetConfig {

        /** 请求失败时的消息处理器类名 */
        public static requestMsgHandler : IMsgHandler;
        /** 同时能http请求的最大次数 0表示开启*/
        public static MAX_HTTP_COUNT : number = 0;
        /** 防止快速点击忽略列表 */
        public static ingoreList : string[] = [];
    }
}