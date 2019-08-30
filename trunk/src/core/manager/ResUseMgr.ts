module core {

    interface ResUseVo {
        num: number;       // 使用次数
        lastTime: number;  // 上次释放时间,秒
    }
    
    export class ResUseMgr {

        private static _resDic: any = {};          // 资源使用字典
        public static TICK_TIME: number = 30;      // 定时间隔检测时间
        public static DESTROY_TIME: number = 180;  // 销毁时间，多久时间没使用，进行销毁

        constructor() {
        }

        /** 开启定时 */
        static startTick(): void {
            Laya.timer.clear(this, this.checkRes);
            Laya.timer.loop(ResUseMgr.TICK_TIME * 1000, this, this.checkRes);
        }

        /** 检测资源是否需要释放 */
        private static checkRes(): void {
            let curTime = (new Date().getTime()) / 1000;
            for (let url in this._resDic) {
                let info = this._resDic[url] as ResUseVo;
                if (!info) {
                    delete this._resDic[url];
                    continue;
                }
                if (info.num == 0 && info.lastTime > 0 && (curTime - info.lastTime) >= ResUseMgr.DESTROY_TIME) {
                    this._resDic[url] = null;
                    delete this._resDic[url];
                    Laya.loader.clearTextureRes(url);
                    loghgy("销毁资源",url);
                }
            }
        }

        /** 使用资源 */
        static useRes(urls: string[]): void {
            if(!urls) return;
            for (let url of urls) {
                if (!this._resDic[url]) {
                    this._resDic[url] = { num: 0 };
                }
                let info = this._resDic[url] as ResUseVo;
                ++info.num;
                info.lastTime = 0;
                if (info.num <= 0) {
                    logerror("ResUseManager.资源使用错误,次数<=0", url,info.num);
                }
                loghgy("使用资源",url,info.num);
            }
        }

        /** 释放资源 */
        static releaseRes(urls: string[]): void {
            if(!urls) return;
            for (let url of urls) {
                let info = this._resDic[url] as ResUseVo;
                if (!info || info.num <= 0) continue;
                --info.num;
                info.lastTime = (new Date().getTime()) / 1000;
                loghgy("释放资源",url,info.num);
            }
        }

        /** 是否存在资源 */
        static isExistRes(url:string):boolean {
            let info = this._resDic[url] as ResUseVo;
            return info && info.num > 0;
        }

        /** 清除定时 */
        static clearTick(): void {
            Laya.timer.clear(this, this.checkRes);
        }
    }

    
}