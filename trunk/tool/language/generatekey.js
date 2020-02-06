
// 优化语音包的key 

var fs = require('fs');

//lang.lang 读取语言包
var langmap = JSON.parse(fs.readFileSync("../../bin/lang.lang").toString());
var num = 1;
var progessStr = "";
var keymap = {}; // 新旧的key映射 oldkey:newkey
for(var oldkey in langmap){
    progessStr += "修改oldkey："+oldkey+"\n";
    // 是否包含中文
    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
    if(reg.test(oldkey)){
        if(!keymap[oldkey]){
            let newkey = "lang" + num;
            keymap[oldkey] = newkey;
            num++;
            progessStr += "存储到keymap中,val为："+newkey+"\n";
        }else{
            progessStr += "keymap中已包含该oldkey不存储：\n";
        }
    }else{
        progessStr += "不包含中文不改变：\n";
    }
    progessStr += "---------------\n";
}
// fs.writeFileSync("./langprogess.json",progessStr);
// console.log("成功写入流程langprogess.json");
// console.log("--------------------------------\n");
fs.writeFileSync("./langkey.json",JSON.stringify(keymap));
console.log("成功写入key.json,oldkey与newkey的映射");
console.log("--------------------------------\n");

// 替换key
for(var oldkey in langmap){
    if(keymap[oldkey]){
        langmap[keymap[oldkey]] = langmap[oldkey];
        delete langmap[oldkey];
    }
}
fs.writeFileSync("../../bin/lang.lang",JSON.stringify(langmap));
console.log("成功修改lang.lang的key");
console.log("--------------------------------\n");

// 使用key:value形式替换，如果使用字符串replace还需考虑特殊字符全局匹配,麻烦
var uijson = JSON.parse(fs.readFileSync("../../bin/ui.json").toString());
// 替换uijson的文本
replaceTextVal(uijson,keymap);

function replaceTextVal(obj,keymap) {
    if( !isObject(obj) ) return;
    for(var key in obj){
        var val = obj[key];
        if(isString(val)){
            if(keymap[val]){
                console.log("成功修改ui.json的key",obj[key],keymap[val]);
                obj[key] = keymap[val];
            }
        }else{
            replaceTextVal(val,keymap);
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
fs.writeFileSync("../../bin/ui.json",JSON.stringify(uijson));
console.log("成功修改ui.json的文本内容");