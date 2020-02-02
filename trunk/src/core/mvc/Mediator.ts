
module core {

    export class Mediator implements IMediator {

		static NAME: string = 'Mediator';
        mediatorName: string = null;
        constructor(mediatorName: string = null) {
            this.mediatorName = (mediatorName != null) ? mediatorName : Mediator.NAME;
        }

        getName(): string {
            return this.mediatorName;
        }
        
        /** 注册 */
        onRegister(): void {

        }

		/** 需要接收的各种事件 */
        listEvents(): string[] {
            return [];
        }

		/** 处理事件 */
        handleNotification(evt: IBaseEvent): void {

        }

		/** 移除*/
        onRemove(): void {

        }
    }

}