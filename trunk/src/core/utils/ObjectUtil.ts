
module util {

    export class obj {


        static isString(obj: any): boolean {
            return (typeof obj == 'string') && obj.constructor == String;
        }
        static isArray(obj: any): boolean {
            return (typeof obj == 'object') && obj.constructor == Array;
        }
        static isNumber(obj: any): boolean {
            return (typeof obj == 'number') && obj.constructor == Number;
        }
        static isFunction(obj): boolean {
            return (typeof obj == 'function') && obj.constructor == Function;
        }
        static isObject(obj): boolean {
            return (typeof obj == 'object') && obj.constructor == Object;
        }
        static isDate(obj): boolean {
            return (typeof obj == 'object') && obj.constructor == Date;
        }

        /** 对比数组是否有改变 */
        static aryIsChange(ary1: any[], ary2: any[]): boolean {
            if (ary1.length != ary2.length) return true;
            for (let i = 0, len = ary1.length; i < len; i++) {
                if (ary1[i] !== ary2[i]) {
                    return true;
                }
            }
            return false;
        }

        static Obj2Array(object: Object): Array<any> {
            let arr: Array<any> = new Array<any>();
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    arr.push(object[key]);
                }
            }
            return arr;
        }

        static deepClone(obj): any {
            if (!obj && typeof obj !== 'object') {
                return null;
            }
            var newObj = Array.isArray(obj) ? [] : {};
            for (var key in obj) {
                if (obj[key]) {
                    if (obj[key] && typeof obj[key] === 'object') {
                        newObj[key] = Array.isArray(obj[key]) ? [] : {};
                        //递归
                        newObj[key] = this.deepClone(obj[key]);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
            return newObj;
        }


        
    }
}