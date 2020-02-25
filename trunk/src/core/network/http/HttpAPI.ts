
module core {

    export interface IHttpRoute {
        key: string;
        type?: string;
        name?: string;
        args?: Object;
        return?: string;
    }

    export class HttpAPI {
        /** 用1个字节来存储reqId的字节长度(0~127) */
        public static REQUEST_ID_LEN : number = 1;
        /** 用1个字节来存储routename的字节长度(0~127) */
        public static ROUTE_NAME_LEN : number = 1;

        /** 请求id */
        reqId: number = 0;
        /** 回调函数集合 */
        callbacks: Array<Function>;
        /** 请求路线对象 */
        routeMap: { [key: number]: IHttpRoute } = {};

        private _routeObj: any = {};
        /**
         * http请求
         * @param route 请求路线
         * @param msg 请求参数数据
         * @param cb 请求回调
         * @param showMask 是否显示转圈圈遮罩
         */
        request(route: IHttpRoute, msg: Object, cb:Function, showMask: boolean = true): void {
            msg = msg || {};
            var routeName = route.key;
            if (!routeName) return;
            // 不在忽略列表里面就执行,防双击和快速点击的处理
            if (NetConfig.ingoreList.indexOf(routeName) == -1) {
                let ct = Date.now();
                if (this._routeObj.hasOwnProperty(routeName)) {
                    let tim = this._routeObj[routeName]
                    if ((ct - tim) > 80) {
                        this._routeObj[routeName] = ct;
                    } else {
                        //如果在冷却时间内，就不发送请求
                        return;
                    }
                } else {
                    this._routeObj[routeName] = ct;
                }
            }

            this.reqId++;
            logdebug("network.request：", routeName, msg, this.reqId);
            this.sendMessage(this.reqId, routeName, msg, showMask);
            this.callbacks[this.reqId] = cb;
            this.routeMap[this.reqId] = route;
        }

        /**
         * 发送消息
         * @param reqId 
         * @param routeName 
         * @param msg 
         * @param showMask 
         */
        private sendMessage(reqId: number, routeName: string, msg: any, showMask: boolean) {
            let msgData: any = {};
            // 将所需的对象参数转换成字节数组
            let globalParam = NetConfig._globalParams;
            for (let key in globalParam) {
                msgData[key] = globalParam[key];
            }
            msgData["data"] = msg;
            let bytes: Laya.Byte = ByteUtil.strencode(JSON.stringify(msgData));
            // 加上字节头数据
            bytes = this.gameEncode(reqId, routeName, bytes);

            let cpacket = new Laya.Byte(bytes.length);
            cpacket.writeArrayBuffer(bytes, 0, bytes.length);
            var packet = Package.encode(Package.TYPE_DATA, cpacket);
            this.send(routeName,packet, showMask);
        };

        send(routeName: string, packet: Laya.Byte, showMask :boolean = false) {
            let http: SingleHttp = HttpAPI.createHttp();
            http.addData(NetConfig.httpUrl, packet.buffer, showMask);
            http.addCallback(null,(response)=>{
                network.getInstance().processPackage(response);
            },()=>{
                network.getInstance().processError(routeName);
            });
            HttpQueueMgr.getInstance().push(http);
        };

        /** 封包 -- 加上字节头数据 */
        private gameEncode(reqId: number, routeName: string, msg: Laya.Byte): Laya.Byte {
            var msgLen = 0;

            // 用1个字节来存储reqId的字节长度
            msgLen += HttpAPI.REQUEST_ID_LEN;
            let reqIdLen = ByteUtil.caculateNumberByteLen(reqId);
            msgLen += reqIdLen;

            // 用1个字节来存储routeName的字节长度
            msgLen += HttpAPI.ROUTE_NAME_LEN;
            let routeNameBytes = ByteUtil.strencode(routeName);
            if (routeNameBytes.length > 255) {
                throw new Error('routeName maxlength is overflow');
            }
            msgLen += routeNameBytes.length;

            // 加上body请求参数的字节长度
            if (msg) {
                msgLen += msg.length;
            }

            // buffer
            var buffer = new Laya.Byte(msgLen);
            var offset = 0;

            // add reqId
            buffer[offset++] = reqIdLen;
            offset = this.encodeNumber(reqId, buffer, offset);

            // add route
            buffer[offset++] = routeNameBytes.length;
            offset = this.encodeMsgRoute(routeNameBytes, buffer, offset);

            // // add body
            if (msg) {
                offset = this.encodeMsgBody(msg, buffer, offset);
            }

            return buffer;
        }

        /** 包装reqid -- 在buffer中插入数值字节数组,从offset位置开始 */
        private encodeNumber(id:number, buffer:Laya.Byte, offset:number):number {
            let valueAry = ByteUtil.numberEncodeToAry(id);
            for(let i = 0 ; i < valueAry.length ; i++){
                buffer[offset++] = valueAry[i];
            }
            return offset;
        }

        /** 包装route */
        private encodeMsgRoute(routeByte:Laya.Byte, buffer:Laya.Byte, offset:number):number {
            if (routeByte) {
                ByteUtil.copyArray(buffer, offset, routeByte, 0, routeByte.length);
                offset += routeByte.length;
            } else {
                buffer[offset++] = 0;
            }
            return offset;
        }
        /**
         * 包装数据body
         * @param msg 数据源
         * @param buffer 目标buff
         * @param offset 起始位置
         */
        private encodeMsgBody(msg:Laya.Byte, buffer:Laya.Byte, offset:number):number {
            ByteUtil.copyArray(buffer, offset, msg, 0, msg.length);
            return offset + msg.length;
        }

        /** SingleHttp的标识 */
        static _httpId : number = 0;
        /** 对象池 */
        static _httpPool : SingleHttp[] = [];
        /** 创建http */
        static createHttp():SingleHttp{
            let http : SingleHttp;
            if(HttpAPI._httpPool.length > 0){
                http = HttpAPI._httpPool.shift();
            }else{
                http = new SingleHttp();
                http.httpId = ++HttpAPI._httpId;
            }
            http.initHttp();
            return http;
        }
        /** 回收http */
        static recovery(http:SingleHttp):void {
            http.recovery();
            HttpAPI._httpPool.push(http);
        }

    }
}