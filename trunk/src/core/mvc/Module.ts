
module core {

    export class Module implements IModule {

        static NAME: string = 'Module';
        /** 模块名称 */
        moduleName: string = null;
        constructor(moduleName: string = null) {
            this.moduleName = (moduleName != null) ? moduleName : Mediator.NAME;
        }
        /** 获取模块名称 -- 不能为空，否则无效模块 */
        getName(): string {
            return this.moduleName;
        }

        /** 模块注册 -- 注册各个mediator */
        onRegister(): void {
            
        }

		/** mediator列表 */
        listMediators(): IMediator[] {
            return [];
        }

        /** 模块移除 */
        onRemove(): void {

        }

		
    }

}