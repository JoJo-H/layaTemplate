
module util {
    
    export class brower {

        
        /**
         * 获取浏览器参数
         * @param name 
         */
        static getQueryString(name) {
            if (!window.location || !window.location.search) {
                return null;
            }
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }
    }
}