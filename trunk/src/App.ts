
module common {
    /*
* name;
*/
    export class App {
        static player: Player;
        private static _clientTime: number;
        /** 服务器时间戳（毫秒） */
        private static _serverTime: number;
        public static enterGame: boolean = false;
        constructor() {

        }

        /** 启动游戏 */
        static startGame(): void {
            //todo
            App.player = new Player();
        }

        static exitGame(): void {
            // todo
            clearTimeout(this._tickId);
            this._nextDayFlag = true;
        }

        /** 服务器时间（秒） */
        static get serverTimeSecond(): number {
            return App.serverTime / 1000;
        }

        private static _tickId: number;
        private static _nextDayFlag: boolean = true;   // 跨天请求标识
        /** 设置服务器时间（毫秒） */
        static set serverTime(num) {
            if (App._nextDayFlag) {
                App._nextDayFlag = false;
                let date = new Date(Date.now() + TimeEnum.ONE_DAY_MILSEC);
                date.setHours(0, 0, 0, 0);
                let time = date.getTime() - num + 2000;
                App._tickId = setTimeout(App.updateCrossDayInfo, time);
                logdebug(`-----延迟${time}毫秒之后更新跨天数据------`);
            }
            App._serverTime = num;
            App._clientTime = new Date().getTime();
        }
        /** 更新跨天数据 */
        static updateCrossDayInfo(): void {
            logdebug('-----开始请求更新跨天数据------');
            clearTimeout(App._tickId);
            // PomeloClient.getInstance().request(Protocol.game_common_getCrossDayInfo, null, ($data) => {
            //     if (!$data) {
            //         logdebug('-----请求数据失败，2秒后重新请求跨天数据------');
            //         App._tickId = setTimeout(App.updateCrossDayInfo, 2000);
            //     } else {
            //         logdebug('-----请求数据成功，开始更新跨天数据------');
            //         App._nextDayFlag = true;
            //         App.hero.updateCrossDayInfo($data);
            //     }
            // }, false);
        }

        /** 获取服务器时间（毫秒） */
        static get serverTime(): number {
            let nowTime = new Date().getTime();
            return (App._serverTime + nowTime - App._clientTime);
        }

        /** 获取服务器时间（秒） */
        static getServerTime(): number {
            return this.serverTime / 1000;
        }

       
    }
}