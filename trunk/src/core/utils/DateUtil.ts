
module util {

    export class date {


        /**
         * 转换成cd字符串
         * @param time 秒数
         * @param format 格式  如 hh:mm:ss hh-mm-ss
         * @param type 类型 1、表示小时可大于24(天数转换成小时)    2、表示将分钟可大于60(小时转换成分钟)
         */
        static toCountdown(time: number, format: string, type: number = 0): string {
            let day: number;
            let hour: number;
            if (type == 1) {
                day = 0;
                hour = Math.floor(time / 3600);
                time = time % 3600;
            } else if (type == 2) {
                day = 0;
                hour = 0;
            } else {
                day = Math.floor(time / 86400);
                time = time % 86400;
                hour = Math.floor(time / 3600);
                time = time % 3600;
            }
            let minutes = Math.floor(time / 60);
            time = time % 60;
            let seconds = Math.floor(time);

            let str = format.replace(/((\[)(.*?))?(D{1,2})(([^\]]?)\])?/gi, (all, _, prefix, before, key, suffix, after) => {
                if (prefix == '[' && day <= 0) {
                    return '';
                }
                return (before || "") + this.padNum(day, key) + (after || "");
            });

            str = str.replace(/((\[)(.*?))?(H{1,2})(([^\]]?)\])?/gi, (all, _, prefix, before, key, suffix, after) => {
                if (prefix == '[' && hour <= 0) {
                    return '';
                }
                return (before || "") + this.padNum(hour, key) + (after || "");
            });
            str = str.replace(/((\[)(.*?))?(M{1,2})(([^\]]?)\])?/gi, (all, _, prefix, before, key, suffix, after) => {
                if (prefix == '[' && hour <= 0 && minutes <= 0) {
                    return '';
                }
                return (before || "") + this.padNum(minutes, key) + (after || "");
            });
            str = str.replace(/((\[)(.*?))?(S{1,2})(([^\]]?)\])?/gi, (all, _, prefix, before, key, suffix, after) => {
                if (prefix == '[' && hour > 0) {
                    return '';
                }
                return (before || '') + this.padNum(seconds, key) + (after || '');
            });
            return str;
        }

        static padNum(num, str): any {
            let numStr = num.toString();
            let len = str.length - numStr.length;
            if (len > 0) {
                return '0' + numStr;
            }
            return numStr;
        }

        /** 获取下个月第一个的时间戳 */
        static getNextMonthTime(time: number): number {
            let curData = new Date(time);
            // 11表示12月
            let year = curData.getMonth() == 11 ? curData.getFullYear() + 1 : curData.getFullYear();
            let month = curData.getMonth() == 11 ? 0 : curData.getMonth() + 1;
            let nextMonthDate = new Date(year, month);
            return nextMonthDate.getTime();
        }

        /**当月有多少天 */
        static getMonthDays(): number {
            let curDate: Date = new Date(common.App.serverTimeSecond * 1000);
            let curMonth = curDate.getMonth();
            curDate.setMonth(curMonth + 1);
            curDate.setDate(0);
            return curDate.getDate();
        }
    }
}