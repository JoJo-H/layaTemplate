
module core {
    
    export class NativeHttp {

        private _http : Laya.HttpRequest;
        constructor(){
            var xhr: Laya.HttpRequest = new Laya.HttpRequest();
            xhr.http.timeout = 10000;//设置超时时间；
            xhr.once(Laya.Event.COMPLETE, this, this.completeHandler);
            xhr.once(Laya.Event.ERROR, this, this.errorHandler);
            xhr.on(Laya.Event.PROGRESS, this, this.processHandler);
            xhr.send("res/data.data", "", "get", "text");
             xhr.send("http:xxx.xxx.com?a=xxxx&b=xxx","","get","text");//发送了一个get请求，携带的参数为a = xxxx,b=xxx
             xhr.send("http:xxx.xxx.com","a=xxxx&b=xxx","post","text");
        }

        private processHandler(data:any): void {
            console.log(data);
        }
        private errorHandler(data:any): void {
        }
        private completeHandler(e:any): void {
        }
    }
}