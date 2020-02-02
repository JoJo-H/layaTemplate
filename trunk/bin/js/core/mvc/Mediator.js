var core;
(function (core) {
    class Mediator {
        constructor(mediatorName = null) {
            this.mediatorName = null;
            this.mediatorName = (mediatorName != null) ? mediatorName : Mediator.NAME;
        }
        getName() {
            return this.mediatorName;
        }
        /** 注册 */
        onRegister() {
        }
        /** 需要接收的各种事件 */
        listEvents() {
            return [];
        }
        /** 处理事件 */
        handleNotification(evt) {
        }
        /** 移除*/
        onRemove() {
        }
    }
    Mediator.NAME = 'Mediator';
    core.Mediator = Mediator;
})(core || (core = {}));
//# sourceMappingURL=Mediator.js.map