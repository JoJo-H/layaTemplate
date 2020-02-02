
module core {

    /**
     * 定时器管理器
     * 本类为setTimeout及setInterval和Timer的替代实现，主要是方便程序中Timer事件的生命周期管理，使用起来更为便利。
     * 程序中如用到setTimeout，setInterval及Timer的地方应尽量选择此方案。
     */
    export class TimerMgr {

        private static _instance: TimerMgr;

        private _tickList: TickData[];

        public constructor() {
            if (TimerMgr._instance) {
                throw new Error('单例类不可实例化');
            }
            this._tickList = [];
            Laya.timer.frameLoop(1,this,this.onTick);
        }

        public static get instance(): TimerMgr {
            if (TimerMgr._instance == null) {
                TimerMgr._instance = new TimerMgr();
            }
            return TimerMgr._instance;
        }

        private clearUnvalidData(): void {
            let len = this._tickList.length;
            for (let i = len - 1; i >= 0; i--) {
                let tick = this._tickList[i];
                // && !tick.endCallback
                if (!tick.isValid) {
                    this._tickList.splice(i, 1);
                }
            }
        }

        private onTick(): boolean {
            let timeStamp = Laya.Browser.now();
            let dataList: TickData[] = this._tickList.concat();
            let needRemove: boolean = false;
            for (let i: number = 0, iLen: number = dataList.length; i < iLen; i++) {
                let tickData: TickData = dataList[i];
                if ((timeStamp - tickData.timestamp) > tickData.delay) {
                    if (tickData.isValid) {
                        tickData.timestamp = timeStamp;
                        tickData.count++;
                        if (tickData.callback) {
                            // let t: number = Laya.Browser.now();
                            tickData.callback.call(tickData.thisObj, tickData);
                            // let t1: number = Laya.Browser.now();
                            // if (t1 - t > 2) {
                            //     egret.log(`tick回调耗时:${t1 - t}`);
                            // }
                        }
                        if (tickData.count == tickData.maxCount) {
                            tickData.isValid = false;
                        }
                    } else {
                        if (tickData.count == tickData.maxCount) {
                            // if (tickData.endCallback) {
                            //     tickData.endCallback.call(tickData.thisObj, tickData);
                            //     tickData.endCallback = null;
                            // }
                            needRemove = true;
                        }
                    }
                }
            }
            if (needRemove) {
                this.clearUnvalidData();
            }
            return false;
        }
        /**
         * 添加计时器
         * @param  {Function} callback  回调函数，每周期执行一次回调函数
         * @param  {any} thisObj        this绑定
         * @param  {number} delay       执行周期执行，延迟delay毫秒后执行。
         * @param  {number} replayCount 执行次数，当replayCount <= 0时为无限执行
         * @param  {} ...args           透传参数
         */
        public addTick(callback: Function, thisObj: any, delay: number, replayCount: number, ...args): TickData {
            let dataList: TickData[] = this._tickList;
            if (!dataList) {
                dataList = [];
                this._tickList = dataList;
            }
            let tick: TickData = new TickData(callback, thisObj);
            tick.delay = delay;
            tick.count = 0;
            tick.maxCount = replayCount <= 0 ? Number.MAX_VALUE : replayCount;
            tick.args = args;
            tick.timestamp = Laya.Browser.now()
            tick.isValid = true;
            dataList.push(tick);
            return tick;
        }
        /**
         * 添加计时器
         * @param  {string} tickKey     定时器的key
         * @param  {Function} callback  回调函数，每周期执行一次回调函数
         * @param  {any} thisObj        this绑定
         * @param  {number} delay       执行周期执行，延迟delay毫秒后执行。
         * @param  {number} replayCount 执行次数，当replayCount <= 0时为无限执行
         * @param  {} ...args           透传参数
         */
        public addKeyTick(tickKey: string, callback: Function, thisObj: any, delay: number, replayCount: number, ...args): TickData {
            let tick = this.getTickData(tickKey, thisObj);
            if (tick && !tick.isValid) {
                this.removeTicksByKeyAndContext(tickKey, thisObj);
            }
            if (!tick) {
                tick = this.addTick(callback, thisObj, delay, replayCount, ...args);
                tick.tickKey = tickKey;
            }
            return tick;
        }
        /**
         * 获取定时器数据
         * @param tickKey 
         * @param thisObj 
         */
        public getTickData(tickKey, thisObj): TickData {
            return this._tickList.find((tickData) => {
                return tickData.tickKey == tickKey && tickData.thisObj == thisObj;
            });
        }
        /**
         * 通过回调函数移除对应监听
         * @param  {Function} callback  回调函数
         * @param  {any} thisObj    this绑定
         */
        public removeTick(callback: Function, thisObj: any): void {
            let dataList: TickData[] = this._tickList;
            if (dataList) {
                for (let i: number = dataList.length; i > 0; i--) {
                    let data: TickData = dataList[i - 1];
                    if (!data.isValid || (data.callback == callback && data.thisObj == thisObj)) {
                        dataList.splice(i - 1, 1);
                    }
                }
            }
        }
        /**
         * 移除this绑定相关的计时器
         * @param  {any} thisObj
         */
        public removeTicks(thisObj: any): void {
            let dataList: TickData[] = this._tickList;
            if (dataList) {
                for (let i: number = dataList.length; i > 0; i--) {
                    let data: TickData = dataList[i - 1];
                    if (!data.isValid || data.thisObj == thisObj) {
                        dataList.splice(i - 1, 1);
                    }
                }
            }
        }
        /**
         * 移除tickKey绑定相关的计时器
         * @param  {string} tickKey
         */
        public removeTickByKey(tickKey: string): void {
            let dataList: TickData[] = this._tickList;
            if (dataList) {
                for (let i: number = dataList.length; i > 0; i--) {
                    let data: TickData = dataList[i - 1];
                    if (!data.isValid || data.tickKey == tickKey) {
                        dataList.splice(i - 1, 1);
                    }
                }
            }
        }
        /**
         * 移除tickKey绑定相关的计时器
         * @param tickKey 
         * @param thisObj 
         */
        public removeTicksByKeyAndContext(tickKey: string, thisObj: any): void {
            let dataList: TickData[] = this._tickList;
            if (dataList) {
                for (let i: number = dataList.length; i > 0; i--) {
                    let data: TickData = dataList[i - 1];
                    if (!data.isValid || (data.tickKey == tickKey && data.thisObj == thisObj)) {
                        dataList.splice(i - 1, 1);
                    }
                }
            }
        }
        /**
         * 获取当前的定时器
         * @param type 0：全部  1：有效的 2：无效的
         */
        public getTicks(type: number = 0): TickData[] {
            if (type == 0) return this._tickList;
            let list = this._tickList.filter((data: TickData) => {
                return (type == 1 && data.isValid) || (type == 2 && !data.isValid);
            });
            return list;
        }

        /**
         * 移除所有计时器
         */
        public removeAllTicks(): void {
            this._tickList.length = 0;
        }
    }

    export class TickData extends core.Callback {
        /** key */
        public tickKey: string;
        /** 循环间隔 */
        public delay: number;
        /** 当前执行的第几次 */
        public count: number;  
        /** 执行最大次数 */
        public maxCount: number;
        /** 额外参数 */
        public args: any[];
        /** 当前时间戳--毫秒 */
        public timestamp: number;
        /** 是否有效 */
        public isValid: boolean;
        /** 结束回调 */
        // public endCallback: Function;

        public constructor(callback: Function, thisObj: any) {
            super(callback, thisObj);
        }
    }
}