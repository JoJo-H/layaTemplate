var core;
(function (core) {
    class BaseEvent {
        constructor(type, data, name) {
            this.type = type;
            this.data = data;
            this.name = name;
        }
        getName() {
            return this.name || "BaseEvent";
        }
    }
    core.BaseEvent = BaseEvent;
})(core || (core = {}));
//# sourceMappingURL=BaseEvent.js.map