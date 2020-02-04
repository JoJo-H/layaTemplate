/*
* name;
*/
class ColorConst {
    //获取品质颜色
    static getQulityColor(qulity) {
        switch (qulity) {
            case 1:
                return ColorConst.WHITE;
            case 2:
                return ColorConst.GREEN;
            case 3:
                return ColorConst.BLUE;
            case 4:
                return ColorConst.PURPLE;
            case 5:
                return ColorConst.ORANGE;
            case 6:
                return ColorConst.RED;
        }
        return ColorConst.WHITE;
    }
}
//创建红色色颜色滤镜
ColorConst.redFilter = new Laya.ColorFilter([
    1, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 1, 0,
]);
//创建灰色颜色滤镜
ColorConst.grayFilter = new Laya.ColorFilter([
    0.3086, 0.6094, 0.0820, 0, 0,
    0.3086, 0.6094, 0.0820, 0, 0,
    0.3086, 0.6094, 0.0820, 0, 0,
    0, 0, 0, 1, 0,
]);
//外发光滤镜
ColorConst.lightFilter = new Laya.GlowFilter("#ff0000", 15, 0, 0);
//阴影滤镜
ColorConst.shadowFilter = new Laya.GlowFilter("#000000", 8, 8, 8);
//红
ColorConst.RED = "#ff0000";
//橙
ColorConst.ORANGE = "#ff7000";
//紫
ColorConst.PURPLE = "#b700ff";
//绿
ColorConst.GREEN = "#35cd41";
//蓝
ColorConst.BLUE = "#0000ff";
//白
ColorConst.WHITE = "#ffffff";
//棕色
ColorConst.ZONGSE = "#fff5c1";
//# sourceMappingURL=ColorConst.js.map