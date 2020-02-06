'''
Created on 2018年6月25日

@author: gy
'''
import os
import sys
import zipfile

policedPath = 'E:/log_info/'
outRes = "E:/log_info/back"

def doJob(prefix):
    file_list = []
    for parent, _, filenames in os.walk(policedPath): 
        for filename in filenames:
            if filename.startswith(prefix):
                file_list.append(os.path.join(parent, filename))
                print("filename with full path:"+ os.path.join(parent, filename))
    
    zipFileList(file_list, prefix)
                

def zipFileList(file_list, prefix):
    if not os.path.exists(outRes):
        os.makedirs(outRes)
    z = zipfile.ZipFile("{0}/{1}log.zip".format(outRes, prefix), mode='w', compression=zipfile.ZIP_STORED)
    lenList = len(file_list);
    for i in range(lenList):
        zName = file_list[ i ].replace(policedPath + prefix, "");
        zName = zName.lower()
        z.write(file_list[ i ],zName);
        sys.stdout.write('压缩进度：{0}/{1} {2}\r'.format(i+1, lenList, zName));
        sys.stdout.flush();
        #print("    压缩进度：%d/%d %s" % (i,lenList,zName));
    sys.stdout.write(' ' * 70 + '\r');
    sys.stdout.flush();
    z.close();


if __name__ == "__main__":
    doJob('2018_06_25_16_')
