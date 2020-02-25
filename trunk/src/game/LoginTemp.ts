


class ExtConfig {
    static RELEASE = false;
    static net_host = "";
    static server_host = "";
}

class LoginTemp {

    platparam: any;

    //用户登录信息
    userinfo = { userName: '', uid: '', sex: 0, head: "", pid: 1, gameId: 1, fcm: 0, shiming: 0, time: 0, sign: '', userToken: '' };

    public SSO: string = "/sso";
    /**
     * 初始化登录参数
     */
    private initLogin(): void {
        // 设置外部登录参数
        let time = new Date().getTime();
        this.platparam = { clientVersion: "1", pid: 1, uid: 1, uname: 1, time: Math.floor(time / 1000) };
        //如果是正式环境
        if (!ExtConfig.RELEASE) {
            this.platparam.userName = Laya.LocalStorage.getItem("uname");
            this.platparam.uid = Laya.LocalStorage.getItem("puid");
        }
        if (this.platparam.pid && this.platparam.uid && this.platparam.userName) //检查外部参数
        {
            core.logdebug("开始登录");
            core.showWaiting("开始登录");
            this.sendSSO();
        }
        else if (!ExtConfig.RELEASE) //非调试模式禁止其他方式登录
        {
            core.showUI("LoginView", null);
            core.hideLoading();
        }
        else {
            core.showAlert({ text: "连接失败" });
        }
    }

    /**
     * 验证平台账号
     */
    private sendSSO() {
        let wplatform = this.platparam;
        //拷贝参数
        for (var key in this.userinfo) {
            if (wplatform.hasOwnProperty(key)) {
                this.userinfo[key] = wplatform[key];
            }
        }
        this.userinfo.userToken = encodeURIComponent("");
        this.userinfo.sign = "";
        Laya.LocalStorage.setItem("uname", this.userinfo.userName);
        Laya.LocalStorage.setItem("puid", this.userinfo.uid);
        core.logdebug("sso帐号验证", this.userinfo);
        //开始登录
        PLC.getInstance().sendloginmsg(this, this.SSO, this.userinfo, 'get', ($data: any) => {
            let objdata = JSON.parse($data[0]);
            core.logdebug("======帐号验证成功!======", objdata);
            if (objdata.code == 200) {
                this.platparam.token = objdata.token;
                if (objdata.pid) {
                    Laya.LocalStorage.setItem("pid", objdata.pid);
                }
                if (objdata.uid) {
                    this.sendRealmList(); //开始选服
                }
                else {
                    core.logdebug("serverlist error")
                }

            }
        });
    }

    /**
     * 获取服务器列表
     */
    private sendRealmList() {
        let repUrl: any = "";
        core.logdebug("请求服务器列表");
        PLC.getInstance().sendServermsg(this, ExtConfig.server_host, repUrl, 'post', ($data: any) => {
            core.hideWaiting();
            let objdata = JSON.parse($data[0]);
            core.logdebug("======请求服务器列表成功======", objdata);
            if (objdata && objdata.status == 1) {
                let datas = objdata.data;
                if (!datas) return;
                this.platparam.serverGroupList = datas.group_list;
                this.platparam.serverList = datas.srv_list;
                this.platparam.serverRecentList = datas.hasOwnProperty("recent_login_srv") ? Array.isArray(datas.recent_login_srv) ? {} : datas.recent_login_srv : {};
                core.showUI("SelectListView");
                core.hideWaiting();
            }
        });
    }

    /**
     * 登陆
     */
    private sendLogin(serverInfo) {
        this.platparam.serverInfo = serverInfo;
        this.platparam.serverInfo.serverId = this.platparam.serverInfo.srv_id % 100000;
        core.hideUIByName("SelectListView");
        core.logdebug("登陆游戏服", this.platparam.token, this.platparam.uid, this.platparam.pid);
        let url = serverInfo.address ? serverInfo.address : `https://${serverInfo.domain}/server${serverInfo.merge_id !== "0" ? serverInfo.merge_id : serverInfo.srv_id}/gateway`;
        PLC.getInstance().authEntry(this.platparam.token, this.platparam.uid, { host: url }, () => {
            core.logdebug("=============connect ok!");
            PLC.getInstance().enterGame((data) => {
                // 启动框架
                core.API.startRun();
                //启动模块
                // ModuleList.startup();
                // 进入游戏
                //进入游戏上报
                // var hero = App.hero;
                // var sinfo = window.platform.serverInfo;
                // ExtConfig.gameReport("enterGame", hero.playerId, hero.accountName, sinfo.serverId, sinfo.srv_name, { level: hero.level, vip: hero.vip, charge: hero.welfare.rechargeSum });
            });
        });
    }



}