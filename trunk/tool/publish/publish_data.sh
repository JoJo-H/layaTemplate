codesource=../../../demon_client  #代码发布目录，修改此配置可发布指定版本
publishPath=../../../demon_release #发布目录，修改此配置可指定输出地址
echo "代码目录："$codesource"发布目录："$publishPath

#1.先更新数据
svn update ../../bin

#2.把最新的数据复制过去
cp  ../../bin/data/tb.txt  $publishPath/data/tb.txt

#3.生成版本号
clientVersion=$(svn info $codesource|grep Revision: |awk '{print $2}')  #代码版本
resVersion=$(svn info $codesource/bin|grep Revision: |awk '{print $2}')  #资源版本
sdkVersion=$(svn info $codesource/bin/bingame_hd_sdk.js|grep Revision: |awk '{print $2}')  #资源版本
node publish_data.js $publishPath $clientVersion $resVersion $sdkVersion

#4.提交
echo "----------开始更新!!!------------"
svnPath='E:\demon_release\' #发布目录，修改此配置可指定输出地址
# 转到对应目录下
cd $svnPath
echo $svnPath

cd data
svn st | awk '{if ( $1 == "!") { print $2}}' | xargs svn delete
svn st | awk '{if ( $1 == "?") { print $2}}' | xargs svn add
cd ..
svn st | awk '{if ( $1 == "!") { print $2}}' | xargs svn delete
svn st | awk '{if ( $1 == "?") { print $2}}' | xargs svn add
svn ci -m '更新数据刷新'

#5.完成
echo "----------publish data over!!!------------"
date +%Y-%m-%d-%r
# read -n 1