# blog
用nodejs搭建多人博客练习

# 环境搭建

brew install mongodb
brew install node
npm install -g node-inspector

# 用法
  mongod -dbpath FILE_PATH(例:"/Users/kk/tests/data")
  node-inspector
  
  npm install 
  supervisor --debug ./bin/www


# 查看端口号被占用并杀掉占用的进程的方法

## mac
  查看：sudo lsof -i :port
  杀：sudo kill -9 PID

# 还存在尚未弄懂的问题  
1.express各命令参数  
2.sublime中最简便的调试nodejs的方法

# 图片上传


id name url sort
            "home"
            "lp"

1.文件上传
2.所属分类："home"、"lp"
