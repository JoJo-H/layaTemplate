import os
import sys
import time
import random

filename = 'code.txt'
NUM = 10000
CODE_LEN = 20
RANDOM_LIST = []

def doJob():
	hash = dict()
	filepath = os.path.join(os.getcwd(), filename)
	
	cnt = 0
	while cnt < NUM:
		code = generalCode()
		if code in hash:
			continue
		cnt += 1
		hash[code] = 1
	
	with open(filepath, 'wb') as fp:
		for code, _ in hash.items():
			fp.write((code+'\n').encode(encoding='UTF-8',errors='strict'))

def init():
	for i in range(2,10):
		ch = chr(i + 48)
		RANDOM_LIST.append(ch)
	
	for i in range(26):
		ch = chr(i + 97)
		if ch != 'o' and ch != 'l':
			RANDOM_LIST.append(ch)

def generalCode():
	rrr = len(RANDOM_LIST) - 1
	str = ''
	for i in range(CODE_LEN):
		indx = random.randint(0, rrr)
		str += RANDOM_LIST[indx]

	return str

if __name__ == "__main__":
	init()
	doJob()