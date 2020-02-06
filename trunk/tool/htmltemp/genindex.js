//enger
//2018.10.7

var fs = require('fs');
var scripttags = "    <script src='js/$'></script>";
var scripttagstr = "";
var scriptarr = [];

//1.读取模版html
var indextemp = fs.readFileSync("indextemp.html").toString();
var manifesthtml = fs.readFileSync("manifest.html").toString();
indextemp += manifesthtml;
//4.读取src
scripttagstr += "    <!--jsfile--src-->\r\n";
readdir("../../src");
writescriptag();

//5.使用template替换index.html
indextemp = indextemp.replace("$$", scripttagstr);
indextemp = indextemp.replace("{0}", 0);
indextemp = indextemp.replace("{1}", 0);
indextemp = indextemp.replace("{2}", 0);
fs.writeFileSync("../../bin/index.html", indextemp);
console.log("index.html写入成功！");

//递归读取所有文件目录
function readdir(dirpath) {

    var files = fs.readdirSync(dirpath);

    files.forEach((value, index, array) => {
        if (value.indexOf(".ts") == -1) //目录
        {
            if (value == "scenebase" || value == "extendscene" || value.indexOf(".") != -1) {
                return;
            }
            readdir(dirpath + "/" + value);
        }
        else if (value != "DailogExt.ts" && value != "layaUI.max.all.ts" && value != "UIMgr.ts" && value != "App.ts" && value != "MiniTL3dAdpter.ts" && value != "Launch.ts" && value != "Platform.ts") //这些特殊的排除一下
        {
            var root = dirpath.replace("../../", "");
            root = root.replace("src/", "");
            let stag = scripttags.replace("$", root + "/" + value.replace(".ts", ".js")) + "\r\n";
            let sortindex = 0;
            //sortindex 值越大生成的顺序越靠前
            if (root.indexOf("game/inface") != -1)   //接口
            {
                sortindex = 2;
            }
            else if (root.indexOf("game/battle/base") != -1)//战斗
            {
                sortindex = 2;
            }
            else if (root.indexOf("game/modules/fights/base") != -1)//战斗
            {
                sortindex = 2;
            }
            else if (root.indexOf("game/vo") != -1)  {
                sortindex = 2;
            }
            else if (root.indexOf("game/common") != -1)//公共
            {
                sortindex = 1;
            }
            else {
                sortindex = 0;
            }
            switch (value)  {
                case "LanMgr.ts":
                    sortindex = 6;
                    break;
                case "ItemBox.ts":
                case "BaseFightVo.ts":
                case "ItemVo.ts":
                    sortindex = 5;
                    break;
                case "BuffRenderList.ts":
                    sortindex = 4;
                    break;
                case "Accordion.ts":
                    sortindex = 3;
                    break;
                case "ServerPage.ts":
                    sortindex = 1;
                    break;
            }
            scriptarr.push({ value: stag, sort: sortindex });
        }

    }, null);
}

//写一段
function writescriptag() {
    scriptarr.sort((a, b) => {
        return a.sort - b.sort;
    });
    scriptarr.reverse();
    scriptarr.forEach((value, index, array) => {
        scripttagstr += value.value;
    }, null);
    scriptarr = [];
}