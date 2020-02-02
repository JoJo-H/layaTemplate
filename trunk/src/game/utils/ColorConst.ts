/*
* name;
*/
class ColorConst {

    //创建红色色颜色滤镜
    static redFilter: Laya.ColorFilter = new Laya.ColorFilter([
        1, 0, 0, 0, 0, //R
        0, 0, 0, 0, 0, //G
        0, 0, 0, 0, 0, //B
        0, 0, 0, 1, 0, //A
    ]);
    //创建灰色颜色滤镜
    static grayFilter: Laya.ColorFilter = new Laya.ColorFilter([
        0.3086, 0.6094, 0.0820, 0, 0,  //R
        0.3086, 0.6094, 0.0820, 0, 0, //G
        0.3086, 0.6094, 0.0820, 0, 0,  //B
        0, 0, 0, 1, 0, //A
    ]);
    //外发光滤镜
    static lightFilter: Laya.GlowFilter = new Laya.GlowFilter("#ff0000", 15, 0, 0);
    //阴影滤镜
    static shadowFilter: Laya.GlowFilter = new Laya.GlowFilter("#000000", 8, 8, 8);

    //红
    static RED: string = "#ff0000";
    //橙
    static ORANGE: string = "#ff7000";
    //紫
    static PURPLE: string = "#b700ff";
    //绿
    static GREEN: string = "#35cd41";
    //蓝
    static BLUE: string = "#0000ff";
    //白
    static WHITE: string = "#ffffff";

    //棕色
    static ZONGSE: string = "#fff5c1";

    //获取品质颜色
    static getQulityColor(qulity: number): string {
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