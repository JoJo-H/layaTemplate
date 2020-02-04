
module core {

    export interface IAlertVo {
        confirmCb?: Function;   // 确定回调
        cancelCb?: Function;    // 取消回调
        closeCb?: Function;     // 关闭时的回调
        title?: string          // 标题
        text: string;           // 内容文本
        yes?: string;           // 确定按钮文本 -- 必显示
        no?: string;            // 取消按钮文本 -- 有该字段(可为空)时显示取消按钮
        parm?: any;             // 参数
        confirmNotClose?: boolean; // 确认但不关闭当前提示框
    }
}