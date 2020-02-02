var core;
(function (core) {
    class ResUseMgr {
        constructor() {
        }
        /** 开启定时 */
        static startTick() {
            Laya.timer.clear(this, this.checkRes);
            Laya.timer.loop(ResUseMgr.TICK_TIME * 1000, this, this.checkRes);
        }
        /** 检测资源是否需要释放 */
        static checkRes() {
            let curTime = (new Date().getTime()) / 1000;
            for (let url in this._resDic) {
                let info = this._resDic[url];
                if (!info) {
                    delete this._resDic[url];
                    continue;
                }
                if (info.num == 0 && info.lastTime > 0 && (curTime - info.lastTime) >= ResUseMgr.DESTROY_TIME) {
                    this._resDic[url] = null;
                    delete this._resDic[url];
                    Laya.loader.clearTextureRes(url);
                    core.logdebug("销毁资源", url);
                }
            }
        }
        /** 使用资源 */
        static useRes(urls) {
            if (!urls)
                return;
            for (let url of urls) {
                if (!this._resDic[url]) {
                    this._resDic[url] = { num: 0 };
                }
                let info = this._resDic[url];
                ++info.num;
                info.lastTime = 0;
                if (info.num <= 0) {
                    core.logerror("ResUseManager.资源使用错误,次数<=0", url, info.num);
                }
                core.logdebug("使用资源", url, info.num);
            }
        }
        /** 释放资源 */
        static releaseRes(urls) {
            if (!urls)
                return;
            for (let url of urls) {
                let info = this._resDic[url];
                if (!info || info.num <= 0)
                    continue;
                --info.num;
                info.lastTime = (new Date().getTime()) / 1000;
                core.logdebug("释放资源", url, info.num);
            }
        }
        /** 是否存在资源 */
        static isExistRes(url) {
            let info = this._resDic[url];
            return info && info.num > 0;
        }
        /** 清除定时 */
        static clearTick() {
            Laya.timer.clear(this, this.checkRes);
        }
        /** 加载图集 */
        static loadRes(atlas, showWail = false) {
            return new Promise((resolve, reject) => {
                let unloadList = atlas.filter((url) => {
                    return !Laya.loader.getRes(url);
                });
                if (unloadList.length == 0) {
                    resolve();
                    return;
                }
                core.showWaiting();
                Laya.loader.load(unloadList, Handler.create(null, (result) => {
                    core.hideWaiting();
                    if (result === false) {
                        core.logdebug("资源加载失败：", unloadList);
                        return;
                    }
                    resolve();
                }), Handler.create(null, (value) => {
                    core.waitingProgress(value);
                }));
            });
        }
        /** 是否存在资源 */
        static hasRes(...urlAry) {
            return urlAry.every((url) => {
                return Laya.loader.getRes(url);
            });
        }
    }
    ResUseMgr._resDic = {}; // 资源使用字典
    ResUseMgr.TICK_TIME = 30; // 定时间隔检测时间
    ResUseMgr.DESTROY_TIME = 180; // 销毁时间，多久时间没使用，进行销毁
    core.ResUseMgr = ResUseMgr;
})(core || (core = {}));
//# sourceMappingURL=ResUseMgr.js.map