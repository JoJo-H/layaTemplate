
module core {

    export class DialogEvent extends BaseEvent implements IBaseEvent {

        /** popup或者show之后 */
        public static DIALOG_CREATED : string = "DIALOG_CREATED";
        /** onOpened之后 */
        public static DIALOG_OPENED : string = "DIALOG_OPENED";
        /** onClosed之后 */
        public static DIALOG_CLOSED : string = "DIALOG_CLOSED";

        constructor(type:string,data:any){
            super(type,data);
        }
        getName():string {
            return "DialogEvent";
        }
    }
}