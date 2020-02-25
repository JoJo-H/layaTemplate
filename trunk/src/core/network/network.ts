
module core {

    export class network {
        RES_OLD_CLIENT = 501;
        RES_OK = 200;

        private static _instance: network;
        static getInstance(): network {
            if (!this._instance) {
                this._instance = new network();
            }
            return this._instance;
        }

        decodeIO_protobuf = null;
        decodeIO_encoder = null;
        decodeIO_decoder = null;
        dict = {};    // route string to code
        abbrs = {};   // code to route string
        protobuf = null;
        serverProtos = {};
        clientProtos = {};
        protoVersion = 0;

        handlers: Array<Function>;
        callbacks: Array<Function>;
        sid: any;
        heartbeatTime = 0;
        heartbeatInterval = 0;
        heartbeatTimeout = 0;
        initCallback = null;
        beatinit: boolean = false;
        heartbeatId = null;
        heartbeatTimeoutId = null;
        handshakeCallback = null;

        constructor() {
            this.handlers = new Array<Function>();
            this.handlers[Package.TYPE_HANDSHAKE] = this.handshake.bind(this);
            this.handlers[Package.TYPE_HEARTBEAT] = this.heartbeat.bind(this);
            this.handlers[Package.TYPE_DATA] = this.onData.bind(this);
            this.handlers[Package.TYPE_KICK] = this.onKick.bind(this);
            this.callbacks = new Array<Function>();

        }
        /** 握手成功 */
        handshake(data) {
            if (data.code === this.RES_OLD_CLIENT) {
                this.emit('error', 'client version not fullfill');
                logerror("client version not fullfill");
                core.showAlert({
                    text: "", confirmCb: () => {
                        // this.gameRefresh();
                    }
                });
                return;
            }
            if (data.code !== this.RES_OK) {
                this.emit('error', 'handshake fail');
                logerror("handshake fail");
                return;
            }
            this.sid = data.sid;
            this.handshakeInit(data);
            // 确认握手(响应返回心跳参数)
            var obj: Laya.Byte = Package.encode(Package.TYPE_HANDSHAKE_ACK, ByteUtil.strencode(JSON.stringify({ sid: this.sid })));
            this.send(obj, false);
        };
        /** 初始化数据 */
        handshakeInit(data): void {
            if (data.sys && data.sys.heartbeat) {
                this.heartbeatInterval = data.sys.heartbeat * 1000;   // heartbeat interval
                this.heartbeatTimeout = this.heartbeatInterval * 2;        // max heartbeat timeout
            } else {
                this.heartbeatInterval = 0;
                this.heartbeatTimeout = 0;
            }
            if (!data || !data.sys || !data.sid) {
                return;
            }
            this.sid = data.sid;
            this.dict = data.sys.dict;
            var protos = data.sys.protos;
            //Init compress dict
            if (this.dict) {
                this.abbrs = {};
                for (var route in this.dict) {
                    this.abbrs[this.dict[route]] = route;
                }
            }
            //Init protobuf protos
            if (protos) {
                this.protoVersion = protos.version || 0;
                this.serverProtos = protos.server || {};
                this.clientProtos = protos.client || {};

                if (!!this.protobuf) {
                    this.protobuf.init({ encoderProtos: protos.client, decoderProtos: protos.server });
                }
                if (!!this.decodeIO_protobuf) {
                    this.decodeIO_encoder = this.decodeIO_protobuf.loadJson(this.clientProtos);
                    this.decodeIO_decoder = this.decodeIO_protobuf.loadJson(this.serverProtos);
                }
            }
            if (!!this.decodeIO_protobuf) {
                this.decodeIO_encoder = this.decodeIO_protobuf.loadJson(this.clientProtos);
                this.decodeIO_decoder = this.decodeIO_protobuf.loadJson(this.serverProtos);
            }
        }

        /** 心跳 */
        heartbeat(respData: any) {
            if (respData && respData.hasOwnProperty('now')) {
                API.getInstance().setServerTime(respData.now);
            }
            this.heartbeatTime = Date.now();
            if (this.initCallback) {
                this.initCallback();
                this.initCallback = null;
            }
            if (!this.heartbeatInterval) {
                logwarn("no heartbeat");
                return;
            }
            if (!this.beatinit) {
                this.beatinit = true;
                this.sendHearBeat();
            }
            if (this.heartbeatTimeoutId) {
                clearTimeout(this.heartbeatTimeoutId);
                this.heartbeatTimeoutId = null;
            }

            if (this.heartbeatId) {
                // already in a heartbeat interval
                return;
            }
            this.heartbeatId = setTimeout(function () {
                this.heartbeatId = null;
                this.sendHearBeat();
                this.nextHeartbeatTimeout = Date.now() + this.heartbeatTimeout;
                this.heartbeatTimeoutId = setTimeout(this.heartbeatTimeoutCb.bind(this), this.heartbeatTimeout);
            }.bind(this), this.heartbeatInterval);
        }

        /** 发送心跳 */
        sendHearBeat() {
            var obj = Package.encode(Package.TYPE_HEARTBEAT, ByteUtil.strencode(JSON.stringify({ sid: this.sid })));
            this.send(obj);
        }

        /** 接收数据 */
        onData(data) {
            if (!data) return;
            var msg = data;
            // decode data
            // if (this.decode) {
            //     msg = this.decode(msg);
            // }
            if (!msg) return;
            //logdebug('onData.decode:', msg);
            if (!msg.id) {// server push message
                this.emit(msg.route.name, msg.body);
                return;
            }
            // var reqdata = utils.getMsgValue(msg.body.value, msg.route.returns);
            var reqdata = {};
            logdebug('response:struct:', reqdata);
            var cb = this.callbacks[msg.id];
            delete this.callbacks[msg.id];
            if (typeof cb !== 'function') {
                return;
            }
            //分发事件处理msg  Fix
            let strmsg: string = "";
            if (typeof msg.body.msg === "string") {
                strmsg = str.format(msg.body.msg, msg.body.args);
            } else if (typeof msg.body.msg === "number") {
                // id取配置表
                strmsg = "";
            }
            if (strmsg && strmsg != "") {
                // showToast(strmsg);
            }
            // 返回设置通用数据
            // App.hero.refreshData(reqdata, msg.route.name);
            cb(reqdata, strmsg, msg.body.msg);
        };

        /** 被踢 */
        onKick(data: any) {
            logwarn("onKick", data);
            API.unline = true;
            this.closeheartbeat();
        }

        private _callbacks: any = {};
        public on(event, fn) {
            (this._callbacks[event] = this._callbacks[event] || []).push(fn);
        }
        public emit(event, ...args: any[]) {
            let params = [].slice.call(arguments, 1);
            let callbacks = this._callbacks[event];
            if (callbacks) {
                callbacks = callbacks.slice(0);
                for (let i = 0, len = callbacks.length; i < len; ++i) {
                    callbacks[i].apply(this, params);
                }
            }
            return this;
        }

        send(packet: Laya.Byte, loadFlag = false) {
            let http: core.SingleHttp = core.HttpAPI.createHttp();
            // http.addData(URL, packet.buffer, loadFlag);
            http.send();
            HttpQueueMgr.getInstance().push(http);
        };


        //断开链接
        disconnect(event) {
            this.emit("close", event);
            this.closeheartbeat();
        }

        closeheartbeat() {
            if (this.heartbeatId) {
                clearTimeout(this.heartbeatId);
                this.heartbeatId = null;
            }
            if (this.heartbeatTimeoutId) {
                clearTimeout(this.heartbeatTimeoutId);
                this.heartbeatTimeoutId = null;
            }
            this.heartbeatTime = null;
            this.heartbeatInterval = null;
        }

        /**
         * 接受服务器数据
         * @param respone httpbody
         */
        public processPackage(bytes: Laya.Byte): void {
            let msg = Package.decode(bytes);
            this.handlers[msg.type].apply(this, [msg.body]);
        }

        /** 处理请求失败 -- 弹窗提示重连 */
        public processError(routeName: string): void {
            // alert
        }
    }

}