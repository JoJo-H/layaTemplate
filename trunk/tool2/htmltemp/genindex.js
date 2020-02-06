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
fs.writeFileSync("../../bin/index.html", indextemp);
console.log("index.html写入成功！");

//递归读取所有文件目录
function readdir(dirpath) {

    var files = fs.readdirSync(dirpath);

    files.forEach((value, index, array) => {
        if (value.indexOf(".ts") == -1) //目录
        {
            if (value.indexOf(".") != -1) {
                return;
            }
            readdir(dirpath + "/" + value);
        }
        else  
        {   
            let stag = "";
            let root = "";
            if(value == "App.ts" || value == "Launch.ts"){
                stag = scripttags.replace("$", value.replace(".ts", ".js")) + "\r\n";
            }else{
                root = dirpath.replace("../../", "");
                root = root.replace("src/", "");
                stag = scripttags.replace("$", root + "/" + value.replace(".ts", ".js")) + "\r\n";
            }
            let sortindex = 100;
            //sortindex 值越小生成的顺序越靠前
            if (root.indexOf("core/inface") != -1 || root.indexOf("core/const") != -1 || root.indexOf("core/vo") != -1)   //接口
            {
                sortindex = 2;
            }if (root.indexOf("core/utils") != -1 || root.indexOf("core/network") != -1 )   //接口
            {
                sortindex = 2;
            }else if (root.indexOf("core/mvc") != -1)   //接口
            {
                sortindex = 3;
            }
            switch (value)  {
                case "DialogExt.ts":
                    sortindex = 0;
                    break;
                case "layaUI.max.all.ts":
                case "BuffRenderList.ts":
                    sortindex = 1;
                    break;
            }
            // console.log(stag,sortindex);
            scriptarr.push({ value: stag, sort: sortindex });
        }

    }, null);
}

//写一段
function writescriptag() {
    scriptarr.sort((a, b) => {
        return a.sort - b.sort;
    });
    scriptarr.forEach((value, index, array) => {
        scripttagstr += value.value;
    }, null);
    scriptarr = [];
}