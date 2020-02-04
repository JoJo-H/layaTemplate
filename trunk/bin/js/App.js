var common;
(function (common) {
    /*
* name;
*/
    class App {
        constructor() {
        }
        /** 启动游戏 */
        static startGame() {
            //todo
            App.player = new common.Player();
        }
        static exitGame() {
            // todo
            clearTimeout(this._tickId);
            this._nextDayFlag = true;
        }
        /** 服务器时间（秒） */
        static get serverTimeSecond() {
            return App.serverTime / 1000;
        }
        /** 设置服务器时间（毫秒） */
        static set serverTime(num) {
            if (App._nextDayFlag) {
                App._nextDayFlag = false;
                let date = new Date(Date.now() + TimeEnum.ONE_DAY_MILSEC);
                date.setHours(0, 0, 0, 0);
                let time = date.getTime() - num + 2000;
                App._tickId = setTimeout(App.updateCrossDayInfo, time);
                core.logdebug(`-----延迟${time}毫秒之后更新跨天数据------`);
            }
            App._serverTime = num;
            App._clientTime = new Date().getTime();
        }
        /** 更新跨天数据 */
        static updateCrossDayInfo() {
            core.logdebug('-----开始请求更新跨天数据------');
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
        static get serverTime() {
            let nowTime = new Date().getTime();
            return (App._serverTime + nowTime - App._clientTime);
        }
        /** 获取服务器时间（秒） */
        static getServerTime() {
            return this.serverTime / 1000;
        }
    }
    App.enterGame = false;
    App._nextDayFlag = true; // 跨天请求标识
    common.App = App;
})(common || (common = {}));
//# sourceMappingURL=App.js.map