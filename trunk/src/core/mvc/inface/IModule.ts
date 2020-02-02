
module core {

    export interface IModule {
        getName(): string;
        onRegister(): void;
        listMediators():IMediator[]
        onRemove(): void;
    }
}