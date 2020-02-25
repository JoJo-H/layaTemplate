

class PLC {
    private static _instance: PLC;
    public static getInstance(): PLC {
        if (!this._instance) {
            this._instance = new PLC();
        }
        return this._instance;
    }

    initCallback = null;
    posturl: string = "";

    public sendloginmsg($objthis: any, $sign: string, $parameters: Object, $httpType: string, $comFun: Function, $errFun: Function = null) {
        let http: core.SingleHttp = new core.SingleHttp;
        http.addCallback(null, (data: any) => {
            $comFun.call($objthis, [data]);
        }, (data: any) => {
            core.logdebug("http错误");
            if ($errFun) {
                $errFun.call($objthis, [data]);
            }
        });
        http.addData(ExtConfig.net_host + $sign, $parameters, false, "post", $httpType);
        http.send();
    }

    public sendServermsg($objthis: any, host: string, $parameters: any, $httpType: string, $comFun: Function, $errFun: Function = null) {
        let http: core.SingleHttp = new core.SingleHttp;
        http.addCallback(null, (data: any) => {
            $comFun.call($objthis, [data]);
        }, (data: any) => {
            core.logdebug("http错误");
            if ($errFun) {
                $errFun.call($objthis, [data]);
            }
        });
        http.addData(host, $parameters, false, "post", $httpType);
        http.send();
    }

    /** 自动链接游戏 */
    authEntry(token, uid, server, callback) {
        var self = this;
        this.queryEntry(uid, server, function (host, port) {
            self.entry(host, port, token, callback);
        });
    }

    /** 链接网关服 */
    queryEntry(uid, server, callback) {
        var self = this;
        this.pomeloInit(server.host, server.port, () => {
            // var route = "Protocol.gate_gate_queryEntry";
            // var args = {};
            // args["uid"] = uid;
            // core.network.request(route, args, function (data) {
            //     if (!data) {
            //         return;
            //     }
            //     self.disconnect(null);
            //     callback(data.host, data.httpPort);
            // });
        });
    }

    //初始化游戏服链接
    private pomeloInit($host: string, $port: number, $comFun: Function) {
        this.initCallback = $comFun;
        this.posturl = $host;
        var handshakeBuffer = {
            'sys': {
                type: "",
                version: "",
                rsa: {}
            },
            'user': {}
        };
        let _json = JSON.stringify(handshakeBuffer);
        let _strencode = core.ByteUtil.strencode(_json);
        let packet = core.Package.encode(core.Package.TYPE_HANDSHAKE, _strencode);
        // core.network.send(packet);
    }

    //链接游戏服
    entry(host, port, token, callback) {
        var self = this;
        this.pomeloInit(host, port, function () {
            var route = "Protocol.game_enter_entry";
            var args = {};
            args["route.args.token"] = token;
            core.logdebug("链接游戏服：");
            args["route.args.sid"] = "window.platform.serverInfo.srv_id";
            setTimeout(function () {
                
            }, 500);

        });
    }


    enterGame(calback) {
        var route = "Protocol.game_enter_enterGame";
        var self = this;
        // core.network.request(route, {}, function (data) {
        //     if (!data) {
        //         return;
        //     }
        //     core.logdebug("enterGame succ!![%j]", data);
        //     if (calback) {
        //         calback(data);
        //     }
        // });
    }
}