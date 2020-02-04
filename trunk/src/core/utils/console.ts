
module core {
    // 打印
    var getTimeShortStr: Function = (v: number) => {
        return new Date(v).toTimeString();
    };

    export function logcore(...args: any[]): void {
        if (API.logLevel < 10) return;
        console.log(getTimeShortStr(Laya.timer.currTimer), ...args);
    }

    /**
     * @param args 打印错误
     */
    export function logdebug(...args: any[]): void {
        if (API.logLevel < 3) return;
        console.log(getTimeShortStr(Laya.timer.currTimer), ...args);
    }

    /**
     * @param args 打印错误
     */
    export function logwarn(...args: any[]): void {
        if (API.logLevel < 2) return;
        console.warn(getTimeShortStr(Laya.timer.currTimer), "[W]", ...args);
    }

    /**
     * @param args 打印提示
     */
    export function logerror(...args: any[]): void {
        if (API.logLevel < 1) return;
        console.error(getTimeShortStr(Laya.timer.currTimer), "[E]", ...args);
    }

}