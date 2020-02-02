
module core {
    export interface IMediator {
        getName(): string;
        onRegister(): void;
        listEvents(): string[];
        handleNotification(evt: IBaseEvent): void;
        onRemove(): void;
    }
}