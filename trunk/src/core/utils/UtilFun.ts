
 
// 打印
var getTimeShortStr: Function = (v: number) => {
    return new Date(v).toTimeString();
};

 /**
 * @param args 打印错误
 */
function logdebug(...args: any[]): void {
    if (ExtConfig.LOG_LEVEL < 3) return;
    console.log(getTimeShortStr(Laya.timer.currTimer), ...args);
}

/**
 * @param args 打印错误
 */
function logwarn(...args: any[]): void {
    if (ExtConfig.LOG_LEVEL < 2) return;
    console.warn(getTimeShortStr(Laya.timer.currTimer), "[W]", ...args);
}

/**
 * @param args 打印提示
 */
function logerror(...args: any[]): void {
    if (ExtConfig.LOG_LEVEL < 1) return;
    console.error(getTimeShortStr(Laya.timer.currTimer), "[E]", ...args);
}

function loghgy(...args: any[]): void {
    if (ExtConfig.LOG_LEVEL < 6) return;
    let time = getTimeShortStr(Laya.timer.currTimer);
    console.log(`%c hgy:${time} `, 'color:#ff0000', ...args);
}

/**
 * 生成uuid
 */
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};