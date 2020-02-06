var fs = require("fs");
//path模块，可以生产相对和绝对路径
var path = require("path");
var os = require("os");
var arguments = process.argv.slice(2);
console.log("arguments:",arguments);

var publishPath=arguments[0];
let time=new Date().getTime();
console.log("time span:",time);
var clientVersion=arguments[1];
var resVersion=arguments[2];
var sdkVersion=arguments[3];
var indextemp = fs.readFileSync("../htmltemp/indextemp.html").toString();
indextemp+="</body></html>";
//
indextemp=indextemp.replace("{0}",clientVersion);
indextemp=indextemp.replace("{1}",resVersion);
indextemp=indextemp.replace("{2}",sdkVersion);
var rootfiles;
var listindex=0;
var totol=0;
init();
function init(){
    //写html
    fs.writeFile(publishPath+"/index.html", indextemp,(e)=>{});

    //拷贝tb.txt
    var datarootfiles=fs.readdirSync(publishPath+"/data");
    console.log("rootfiles:",datarootfiles);
    var versionStr=fs.readFileSync(publishPath+"/version.json").toString();
    var oldname;
	let newname;
    for(var $k in datarootfiles){
        var $file = datarootfiles[$k];
		console.log("data list:",$file);
		if($file!="tb.txt"){
			oldname=$file;
			newname=$file.split('.')[0].split('-')[0];
			fs.unlinkSync(publishPath+"/data/"+$file,function (err) {}); //删除旧的
		}
    }
	newname=newname+"-"+resVersion+".txt";
	console.log("oldname:",oldname);
	console.log("newname:",newname);
    versionStr=versionStr.replace(oldname,newname); //替换MD5文件名
	//
    fs.renameSync(publishPath+"/data/tb.txt", publishPath+"/data/"+newname);  //重命名  tb.txt
    fs.writeFile(publishPath+"/version.json", versionStr,(e)=>{}); 
}
