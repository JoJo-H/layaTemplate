var fs = require("fs");
//path模块，可以生产相对和绝对路径
var path = require("path");
var os = require("os");
var arguments = process.argv.slice(2);
var moduleRoot="../../src/game/modules/"; //模块根目录
var _moduleName="";
var _littlemoduleName="";
var _moduleDir="";
genModule(arguments[0]);

// 1、转换成大写：toUpperCase()
// 2、转换成小写：toLowerCase()
function genModule(modulename){ //模块名字
    _littlemoduleName=modulename.toLowerCase();
    _moduleName=_littlemoduleName.charAt(0).toUpperCase()+_littlemoduleName.substring(1,_littlemoduleName.length);
    _moduleDir=moduleRoot+_littlemoduleName;
    console.log("module info:",_littlemoduleName,_moduleName,_moduleDir);
    if(fs.exists(_moduleDir)){
        console.log("模块已存在不能重复创建");
        return;
    }
    createFolders();
    createClasses();
}

//创建文件夹
function createFolders(){
    fs.mkdir(_moduleDir,function(error){
        if(error){
            console.log(error);
            return false;
        }
        else
        {
            fs.mkdir(_moduleDir+"/view",function(error){if(error){console.log(error);return false;}else{
                 fs.mkdir(_moduleDir+"/view/render",function(error){if(error){console.log(error);return false;}});
            }});
            fs.mkdir(_moduleDir+"/vo",function(error){if(error){console.log(error);return false;}});
            return true;
        }
    });
 
}

//创建类
function createClasses()
{
    let model=fs.readFileSync("./temp/Model").toString();
    let mmodule=fs.readFileSync("./temp/Module").toString();
    let processor=fs.readFileSync("./temp/Processor").toString();
    model=replaceName(model);
    mmodule=replaceName(mmodule);
    processor=replaceName(processor);
    //
    fs.writeFileSync(_moduleDir+"/"+_moduleName+"Model.ts",model);
    fs.writeFileSync(_moduleDir+"/"+_moduleName+"Module.ts",mmodule);
    fs.writeFileSync(_moduleDir+"/"+_moduleName+"Processor.ts",processor);
    console.log("模块创建成功！");
}

//替换模块名
function replaceName(classStr)
{
    classStr=classStr.replace(new RegExp('&', 'g'), _moduleName);//替换模块名
    classStr=classStr.replace(new RegExp('#', 'g'), _littlemoduleName); //替换包名

    return classStr;
}