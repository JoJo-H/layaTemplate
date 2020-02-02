var core;
(function (core) {
    class Module {
        constructor(mediatorName = null) {
            /** 模块名称 */
            this.moduleName = null;
            this.moduleName = (mediatorName != null) ? mediatorName : core.Mediator.NAME;
        }
        /** 获取模块名称 -- 不能为空，否则无效模块 */
        getName() {
            return this.moduleName;
        }
        /** 模块注册 -- 注册各个mediator */
        onRegister() {
        }
        /** mediator列表 */
        listMediators() {
            return [];
        }
        /** 模块移除 */
        onRemove() {
        }
        /**
         * 获取Mediator
         * @param mediatorName
         */
        retrieveMediator(mediatorName) {
            return this._mediatorMap[mediatorName] || null;
        }
        removeMediator(mediatorName) {
            let mediator = this._mediatorMap[mediatorName];
            if (!mediator)
                return null;
            let interests = mediator.listEvents();
            let i = interests.length;
            while (i--) {
                this.removeObserver(interests[i], mediator);
            }
            delete this._mediatorMap[mediatorName];
            mediator.onRemove();
            return mediator;
        }
        hasMediator(mediatorName) {
            return this._mediatorMap[mediatorName] != null;
        }
    }
    Module.NAME = 'Module';
    core.Module = Module;
})(core || (core = {}));
//# sourceMappingURL=Module.js.map