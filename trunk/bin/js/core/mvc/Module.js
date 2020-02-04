var core;
(function (core) {
    class Module {
        constructor(moduleName = null) {
            /** 模块名称 */
            this.moduleName = null;
            this.moduleName = (moduleName != null) ? moduleName : core.Mediator.NAME;
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
    }
    Module.NAME = 'Module';
    core.Module = Module;
})(core || (core = {}));
//# sourceMappingURL=Module.js.map