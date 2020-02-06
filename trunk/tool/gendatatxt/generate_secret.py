# coding=utf-8
import sys
import random

randomInt = random.randint
IT = (('0', '9'), ('a', 'z'), ('A', 'Z'))
SESSION_SECRET_SIZE = 64
PWD_SECRET_SIZE = 32

def generate(size):
	for i in range(size):
		item = IT[randomInt(0, 2)]
		yield chr(randomInt(ord(item[ 0 ]), ord(item[ 1 ])))
	
if __name__ == '__main__':
	print("session_secret:" + ''.join(generate(SESSION_SECRET_SIZE)))
	print("pwd_secret:" + ''.join(generate(PWD_SECRET_SIZE)))