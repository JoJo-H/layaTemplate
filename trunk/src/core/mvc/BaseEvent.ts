
module core {

    export class BaseEvent implements IBaseEvent{

        data : any;
        type : string;
        name : string;
        constructor(type:string,data:any,name?:string){
            this.type = type;
            this.data = data;
            this.name = name;
        }

        getName():string {
            return this.name || "BaseEvent";
        }
    }
}