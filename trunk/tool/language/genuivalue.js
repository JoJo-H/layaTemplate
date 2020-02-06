// 更改UI文件xxx.ui中的文本 为 翻译最终文本

var fs = require('fs');
// 原始 旧key:新key
var keymap = JSON.parse(fs.readFileSync("./langkey.json").toString());
// 翻译后的数据
var transfmap = JSON.parse(fs.readFileSync("../../bin/lang.lang").toString());
// 值
var valmap = {};
for(var key in keymap) {
    var newkey = keymap[key];
    if(transfmap[newkey]){
        valmap[key] = transfmap[newkey];
    }
}
readdir("../../laya/pages",valmap);

//递归读取所有文件目录
function readdir(dirpath,keymap) {

    var files = fs.readdirSync(dirpath);
    files.forEach((value, index, array) => {
        var oriFile = dirpath + "/" + value;
        var stat = fs.lstatSync(oriFile);
        //目录
        if (stat.isDirectory()) {
            readdir(oriFile,keymap);
        } else if(oriFile.indexOf(".ui") != -1){
            var uijson = JSON.parse(fs.readFileSync(oriFile).toString());
            replaceTextVal(oriFile,uijson,keymap);
            fs.writeFileSync(oriFile,JSON.stringify(uijson));
        }
    }, null);
}

function replaceTextVal(oriFile,obj,keymap) {
    if( !isObject(obj) ) return;
    for(var key in obj){
        var val = obj[key];
        if(isString(val)){
            if(keymap[val]){
                console.log(oriFile,"文件的文本成功修改",val,keymap[val]);
                obj[key] = keymap[val];
            }
        }else{
            replaceTextVal(oriFile,val,keymap);
        }
    }
}
// 数组或者对象
function isObject(params) {
    return typeof params == "object";
}
// 是否数组
function isString(params) {
    return typeof params == "string" && params.constructor==String;
}