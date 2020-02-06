var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var DialogExt = core.DialogExt;
var ui;
(function (ui) {
    var test;
    (function (test) {
        class TestPageUI extends DialogExt {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadUI("test/TestPage");
            }
        }
        test.TestPageUI = TestPageUI;
    })(test = ui.test || (ui.test = {}));
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map