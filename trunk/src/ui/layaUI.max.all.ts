
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
import DialogExt=core.DialogExt;
module ui.test {
    export class TestPageUI extends DialogExt {
		public btn:Laya.Button;
		public clip:Laya.Clip;
		public combobox:Laya.ComboBox;
		public tab:Laya.Tab;
		public list:Laya.List;
		public btn2:Laya.Button;
		public check:Laya.CheckBox;
		public radio:Laya.RadioGroup;
		public box:Laya.Box;

        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.loadUI("test/TestPage");

        }

    }
}
