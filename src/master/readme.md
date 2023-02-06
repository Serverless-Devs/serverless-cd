## 本地调试

1. 进入 yaml 配置的目录
2. 运行命令 `s master local start --server-port 3333`
3. 进入到应用创建的webhook页面获取到请求体和请求头
4. 发送一个post请求，请求头和请求体使用第三步的数据，链接地址是  `http://localhost:3333?app_id=应用id`