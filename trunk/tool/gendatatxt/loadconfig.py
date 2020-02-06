import configparser

def loadPath():
	config = configparser.ConfigParser()
	# 配置文件的编码为txt的默认编码
	config.read("config.ini",encoding="utf-8")
	group = "Path"
	ep = config.get(group, "excel")
	cp = config.get(group, "client")
	sp = config.get(group, "server")
	pp = config.get(group, "python")
	
	return ep, cp, sp, pp

if __name__ == "__main__":
	loadPath()