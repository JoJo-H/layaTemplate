
module core {

    export interface IMsgHandler {
        
        onHandler(msgid:number,msg?:string,data?:any):void;
    }
}