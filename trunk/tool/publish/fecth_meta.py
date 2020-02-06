#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os
import sys
import yaml
import shutil
import json
import hashlib

dir1 = "../../bin/"

print("--------------begin build meta file--------------")
version = sys.argv[1]

print("version is:" + version)

#生成文件的md5
def getfileMd5(filename):
    if not os.path.isfile(filename):
        return
    myhash = hashlib.md5()
    f = open(filename,'rb')
    while True:
        b = f.read(8096)
        if not b :
            break
        myhash.update(b)
    f.close()
    return myhash.hexdigest()

code_map = ( 
      'a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 
      'i' , 'j' , 'k' , 'l' , 'm' , 'n' , 'o' , 'p' , 
      'q' , 'r' , 's' , 't' , 'u' , 'v' , 'w' , 'x' , 
      'y' , 'z' , '0' , '1' , '2' , '3' , '4' , '5' , 
      '6' , '7' , '8' , '9' , 'a' , 'b' , 'c' , 'd' , 
      'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 
      'm' , 'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 
      'u' , 'v' , 'w' , 'x' , 'y' , 'z')

def get_hash_key(hex): 
  for i in range(0, 1): 
    n = int(hex[i*8:(i+1)*8], 16) 
    v = [] 
    e = 0
    for j in range(0, 7): 
      x = 0x0000003D & n 
      e |= ((0x00000002 & n ) >> 1) << j 
      v.insert(0, code_map[x]) 
      n = n >> 6
    e |= n << 5
    v.insert(0, code_map[e & 0x0000003D]) 
  return ''.join(v)

if not os.path.exists(dir1): #源目录不存在 退出
    print("can not find path:" + dir1)
    print("script stoped")
    os._exit(0)

# 生成meta.json
total=0
meta_str = {
    "version": int(version),
    "total":total,
    "res": {}
}

meta_dic = meta_str["res"]

version_str={}

for fpathe,dirs,fs in os.walk(dir1):
  for f in fs:
    copypath = fpathe
    dirkey = copypath.replace(dir1, '')
    if dirkey.find('.svn')>-1: #过滤.svn文件
        continue
    if dirkey.find('js')>-1: #过滤js文件
        continue
    if dirkey.find('libs')>-1: #过滤libs文件
        continue
    key = os.path.join(fpathe,f).replace(dir1, '')
    if key.find('meta.json')>-1:#过滤meta文件
        continue
    valve = getfileMd5(os.path.join(fpathe,f))
    total+=1
    key=key.replace('\\', '/')
    meta_dic[key] = valve
    keyarr=list(key)
    keyarr.insert(key.rfind('.'),get_hash_key(valve))  #把md5短码插到文件名
    version_str[key]=''.join(keyarr)

meta_str["total"]=total
with open(os.path.join(dir1, "meta.json"), "w", encoding="utf-8") as f:
    json.dump(meta_str, f)
f.close()


with open(os.path.join(dir1, "version.json"), "w", encoding="utf-8") as f:
    json.dump(version_str, f)
f.close()

print("------------------build  finished----------------")
