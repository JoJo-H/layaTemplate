var core;
(function (core) {
    class NativeHttp {
        constructor() {
            var xhr = new Laya.HttpRequest();
            xhr.http.timeout = 10000; //设置超时时间；
            xhr.once(Laya.Event.COMPLETE, this, this.completeHandler);
            xhr.once(Laya.Event.ERROR, this, this.errorHandler);
            xhr.on(Laya.Event.PROGRESS, this, this.processHandler);
            xhr.send("res/data.data", "", "get", "text");
            xhr.send("http:xxx.xxx.com?a=xxxx&b=xxx", "", "get", "text"); //发送了一个get请求，携带的参数为a = xxxx,b=xxx
            xhr.send("http:xxx.xxx.com", "a=xxxx&b=xxx", "post", "text");
        }
        processHandler(data) {
            console.log(data);
        }
        errorHandler(data) {
        }
        completeHandler(e) {
        }
    }
    core.NativeHttp = NativeHttp;
})(core || (core = {}));
//# sourceMappingURL=NativeHttp.js.map