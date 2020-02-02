var core;
(function (core) {
    class DialogEvent extends core.BaseEvent {
        constructor(type, data) {
            super(type, data);
        }
        getName() {
            return "DialogEvent";
        }
    }
    /** popup或者show之后 */
    DialogEvent.DIALOG_CREATED = "DIALOG_CREATED";
    /** onOpened之后 */
    DialogEvent.DIALOG_OPENED = "DIALOG_OPENED";
    /** onClosed之后 */
    DialogEvent.DIALOG_CLOSED = "DIALOG_CLOSED";
    core.DialogEvent = DialogEvent;
})(core || (core = {}));
//# sourceMappingURL=DialogEvent.js.map