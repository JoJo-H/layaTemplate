var core;
(function (core) {
    class ByteUtil {
        /** 字符串转字节数组 */
        static strencode(str) {
            let byte = new Laya.Byte();
            byte.writeUTFBytes(str);
            return byte;
        }
        /** 字节数组转字符串 */
        static strdecode(buffer, offset) {
            var body = new Laya.Byte();
            var index = offset;
            var bytesLen = buffer.byteLength || buffer["length"];
            for (; index < bytesLen; index++) {
                body.writeByte(buffer[index]);
            }
            body.pos = 0;
            let bodystr = body.readUTFBytes();
            return bodystr;
        }
        /**
         * 数值转换成字节数组,静态固定4个字节 小端存储
         * @param value
         */
        static numberEncode(value) {
            // 不管数值大小,会给四个字节去存储,空位置补0 比如10000,生成的字节的length=4.[16,39,0,0,...];
            let byte = new Laya.Byte();
            byte.writeInt32(value);
            byte.pos = 0;
            console.log(byte.getInt32());
            return byte;
        }
        /**
         * 字节解析成数值
         * @param byte
         */
        static numberDecode(byte) {
            let value = byte.getInt32();
            return value;
        }
        /**
         * 数值转换成数值数组,动态获取真正的字节数值数组 -- 传入值是几个字节就存储几个字节,小端存储
         * @param value 要转换的值 -- 必须正负整数,最大值为Math.pow(2,31)-1
         */
        static numberEncodeToAry(value) {
            let valueAry = [];
            let result = 0;
            if (value > 0) {
                result = value;
            }
            else {
                //求补码 负数以原码的补码形式表达,前往doc文件夹了解
                //取反加1 负数的原码与负数的补码 |位算法后为0xffffffff，所以可以当作0xffffffff-Math.abs(value)为反码,则补码+1
                result = 0xffffffff - Math.abs(value) + 1;
            }
            do {
                // 算出最后一个字节(8位)的值 & 11111111
                let last = result & 0xff;
                valueAry.push(last);
                // 无符号向右移动8位,有符号的移动可能会变成负数 -- 无论值的正负，都在高位补0.
                result = result >>> 8;
            } while (result > 0);
            return valueAry;
        }
        /** 字节数值数组解析成数值 -- 小端存储 */
        static numberDecodeFromAry(arr) {
            let byte = 8;
            let value = 0;
            for (let i = 0; i < arr.length; i++) {
                value += (arr[i] << i * byte);
            }
            return value;
        }
        /** 计算数值的所需字节长度 */
        static caculateNumberByteLen(value) {
            var len = 0;
            do {
                len += 1;
                value >>= 8;
            } while (value > 0);
            return len;
        }
        /**
         * 复制字节数组
         * @param dest 目标字节数组
         * @param doffset 目标起始遍历的位置
         * @param src 源字节数组
         * @param soffset 源起始位置
         * @param length 复制的长度
         */
        static copyArray(dest, doffset, src, soffset, length) {
            if (src instanceof ArrayBuffer) {
                for (var index = 0; index < length; index++) {
                    dest[doffset++] = src[soffset++];
                }
            }
            else {
                for (var index = 0; index < length; index++) {
                    dest[doffset++] = src._getUInt8(soffset++);
                }
            }
        }
    }
    core.ByteUtil = ByteUtil;
})(core || (core = {}));
//# sourceMappingURL=ByteUtil.js.map