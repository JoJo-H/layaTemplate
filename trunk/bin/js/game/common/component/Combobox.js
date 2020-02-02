// module core {
//     export class Combobox extends ui.component.ComboboxUI{
//         private _selectedIndex : number;
//         private _labelList : Laya.Box[];
//         public selectHandler : Laya.Handler;
//         public showHandler : Laya.Handler;
//         constructor(){
//             super();
//             this.boxContent.visible = false;
//             this.boxContent.y = this.height + 4;
//             this._labelList = [];
//             this.mouseThrough = false;
//         }
//         set dataSource(labels:string[]){
//             this._dataSource = labels;
//             this.renderView();
//         }
//         get dataSource():string[]{
//             return this._dataSource;
//         }
//         private renderView():void {
//             let strList = this.dataSource;
//             if(strList && strList.length > 0) {
//                 this.removeLabels();
//                 this._labelList.length = 0
//                 let boxY = 4;
//                 for(let i = 0 ; i < strList.length ; i ++){
//                     let boxLabel = new Laya.Box();
//                     boxLabel.x = 0;
//                     boxLabel.height = this.lbValue.fontSize + 8;
//                     boxLabel.width = this.boxContent.width;
//                     boxLabel.y = boxY;
//                     boxY += boxLabel.height;
//                     this.boxContent.addChild(boxLabel);
//                     let label = new Laya.Label(strList[i]);
//                     label.bold = this.lbValue.bold;
//                     label.fontSize = this.lbValue.fontSize;
//                     label.color = this.lbValue.color;
//                     label.stroke = this.lbValue.stroke;
//                     label.strokeColor = this.lbValue.strokeColor;
//                     label.x = this.lbValue.x;
//                     label.centerY = 0;
//                     boxLabel.addChild(label);
//                     boxLabel.on(Laya.Event.CLICK,this,this.onSelect,[i]);
//                     this._labelList.push(boxLabel);
//                 }
//                 this.boxContent.height = boxY;
//                 this.height = this.boxContent.y + this.boxContent.height;
//                 this.boxContent.visible = false;
//                 this.btnShow.on(Laya.Event.CLICK,this,this.onOpenOrHide);
//                 this.imgBg.on(Laya.Event.CLICK,this,this.onOpenOrHide);
//             }else{
//                 this.removeLabels();
//                 this.boxContent.visible = false;
//                 this.btnShow.off(Laya.Event.CLICK,this,this.onOpenOrHide);
//                 this.imgBg.off(Laya.Event.CLICK,this,this.onOpenOrHide);
//             }
//         }
//         removeLabels():void {
//             for(let label of this._labelList){
//                 label.offAll();
//                 label.removeSelf();
//             }
//             this._labelList.length = 0;
//         }
//         private onOpenOrHide():void {
//             this.boxContent.visible = !this.boxContent.visible;
//             if(this.showHandler){
//                 this.showHandler.runWith(this.boxContent.visible);
//             }
//             if(this.boxContent.visible){
//                 Laya.timer.callLater(this,()=>{
// 					this.stage.on(Laya.Event.CLICK,this,this.onClickView);
// 				});
//             }else{
//                 this.stage.off(Laya.Event.CLICK,this,this.onClickView);
//             }
//         }
//         private onClickView(event:Laya.Event):void {
// 			let target = event.target;
// 			if(target != this){
// 				this.onOpenOrHide();
// 			}
// 		}
//         private onSelect(index:number):void {
//             this.selectedIndex = index;
//         }
//         set selectedIndex(index:number){
//             if(this._selectedIndex != index){
//                 this._selectedIndex = index;
//                 let strList = this.dataSource;
//                 this.lbValue.text = strList ? strList[index] : "无";
//                 if(this.selectHandler){
//                     this.selectHandler.runWith(index);
//                 }
//             }
//         }
//         get selectedIndex():number{
//             return this._selectedIndex;
//         }
//     }
// }
//# sourceMappingURL=Combobox.js.map