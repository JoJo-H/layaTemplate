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
var pid=arguments[5];
var indextemp = fs.readFileSync(String(arguments[4])).toString();
indextemp+="</body></html>";
//
indextemp=indextemp.replace("{0}",clientVersion);
indextemp=indextemp.replace("{1}",resVersion);
indextemp=indextemp.replace("{2}",sdkVersion);
if(pid == 5){
	// 乐众平台引入脚本
	indextemp = indextemp.replace("</body>","\r\n	<script src='https://sdk.lezhonggame.com/Scripts/h5/v2/mlh5.wap.js?v=201910301600'></script>\r\n</body>");
}
var changlist=["cy.sdk","bingame_sdk","md5","fundebug.2.0.0.min","vconsole.min","bingo","favicon","sha1",
			"extconfig","extconfig_qa_debug","extconfig_local_debug","extconfig_debug","extconfig_local","extconfig_local_test","extconfig_remote",
			"extconfig_remotewx","extconfig_banshu","extconfig_lezhong","extconfig_ck","extconfig_remote_hgame","extconfig_pingce"];
var rootfiles=[];
var configfiles=[];
var listindex=0;
var totol=0;
init();
function init(){
	//清理文件
    deleteFolder(publishPath+"js");
    deleteFolder(publishPath+"libs");
	totol=changlist.length;
	console.log("1.-------------清理-----------------");
	resloveFile();	
}

//处理删除
function resloveFile(){
	if(listindex<totol){ //逐个处理文件
		var file=changlist[listindex];
		listindex++;
		var fullName=getFullName(file);
		if(fullName.indexOf("extconfig") != -1) {
			fullName = "extconfig/" + fullName;
		}
		var fullPath=publishPath+"/"+fullName;
		if(fs.existsSync(fullPath)){ //如果文件已经存在，就删掉
			console.log("delte.",fullPath);
			fs.unlinkSync(fullPath);
			resloveFile(); //处理下一个
		}
	    else
		{
			resloveFile(); //处理下一个
		}
	}
	else
	{
		rootfiles=getFiles(publishPath);
		configfiles=getFiles(publishPath+"/extconfig");
		console.log("2.------------重命名------------------",rootfiles,configfiles);
		listindex=0;
		renameFiles(rootfiles,publishPath);
		listindex=0;
		renameFiles(configfiles,publishPath+"/extconfig");
	}
}

function renameFiles(files,filepath){
	if(listindex<totol){ //逐个处理文件
		var file=changlist[listindex];
		listindex++;
		var fullName=getFullName(file);
		var fullPath=filepath+"/"+fullName;
		var flag=false;
		for(var $k in files){
			var $file = files[$k];
			if($file.indexOf(".git")!=-1||$file.indexOf(".svn")!=-1)
			{
				continue;
			}
			if($file.indexOf(file)!=-1){ //存在就重命名
				console.log(filepath+"/"+$file,"->",fullPath);
				flag=true;
				fs.renameSync(filepath+"/"+$file, fullPath);  //重命名
				renameFiles(files,filepath); 
				break;
			}
		}
		if(!flag){
			renameFiles(files,filepath); 
		}
	}
	else
	{
		console.log("3.------------写入------------------");
		//写html
		fs.writeFile(publishPath+"/index.html", indextemp,(e)=>{});
	}
}

function getFiles(filepath){
	var result = [];
	var files = fs.readdirSync(filepath);
	files.forEach((val,index) => {
		let fPath=path.join(filepath,val);
		let stats=fs.statSync(fPath);
		// if(stats.isDirectory()) finder(fPath);
		if(stats.isFile()) result.push(val);
	});
	return result;
}

function getFullName(file){
      switch(file){
		case "bingo":
			return file+".jpg";
		case "favicon":
			return file+".ico";
		default:
			return file+".js";
	  }
	  return file+".js";
}

function deleteFolder(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath,function (err) {});
            }
        });
        fs.rmdirSync(path,function (err) {});
    }
};
console.log('finished.');

