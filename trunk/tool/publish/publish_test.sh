codesource=../../../demon_client  #代码发布目录，修改此配置可发布指定版本
publishpath=../../../demon_release_test #发布目录，修改此配置可指定输出地址
htmlpath=../htmltemp/indextemp.html #发布目录，修改此配置可指定输出地址
echo "代码目录："$codesource"发布目录："$publishpath

#1.压缩资源
node pngcompress.js $publishpath/gui

#2.清理目录文件
svn up 
clientVersion=$(svn info $codesource|grep Revision: |awk '{print $2}')  #代码版本
resVersion=$(svn info $codesource/bin|grep Revision: |awk '{print $2}')  #资源版本
sdkVersion=$(svn info $codesource/bin/bingame_hd_sdk.js|grep Revision: |awk '{print $2}')  #资源版本
echo "脚本参数："$publishpath"-"$clientVersion"-"$resVersion"-"$sdkVersion
node publish_h5.js $publishpath $clientVersion $resVersion $sdkVersion $htmlpath

#3.完成
echo "----------publish over!!!------------"
date +%Y-%m-%d-%r