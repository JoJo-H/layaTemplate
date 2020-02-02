
module core {
    export interface IObserver  {
        getNotifyMethod(): void;
        setNotifyMethod(notifyMethod: Function): void;
        getNotifyContext(): void;
        setNotifyContext(notifyContext: any): void;
        getPriority(): number;
        setPriority(val: number): void;
        notifyObserver(evt: IBaseEvent): void;
        compareContext(object: any): boolean;
    }
}