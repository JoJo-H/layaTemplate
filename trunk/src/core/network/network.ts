
module core {

    export class network {

        static _httpId : number = 0;
        static _httpPool : SingleHttp[] = [];
        /** 创建http */
        static createHttp():SingleHttp{
            let http : SingleHttp;
            if(network._httpPool.length > 0){
                http = network._httpPool.shift();
            }else{
                http = new SingleHttp();
                http.httpId = ++network._httpId;
            }
            http.initHttp();
            return http;
        }

        /** 回收http */
        static recovery(http:SingleHttp):void {
            http.recovery();
            network._httpPool.push(http);
        }
    }
    
}