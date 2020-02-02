var core;
(function (core) {
    /**
     * 事件数据类
     */
    class EventData extends egret.HashObject {
        constructor(messageID, messageData) {
            super();
            this.messageID = messageID;
            this.messageData = messageData;
        }
    }
    core.EventData = EventData;
})(core || (core = {}));
//# sourceMappingURL=EventData.js.map