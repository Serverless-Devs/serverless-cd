## 目录结构

```textarea
config: // 代码配置目录
  constants.js // 定义常量
  config.js // process.env

middleware: // 插件目录

models:     //

prisma:     // DB模型

public:     // UI目录

routers:    // 路由目录
  - application
    /application
  - task
    /task
  - code-provider
    - github
      /github
  - auth
    /auth/login
    /auth/signin
    /auth/logout
    /auth/bind/github
    /auth/callback/github
  - user
    /user/
  - org
    /org
  - common
    /common

services:    // 处理业务

util:        // 公共方法

views:       // 前端 html 模版文件
```

## 项目启动

> PS: 如果需要使用`prisma`，则需要在目录下创建`.env`文件，内容需要有`DATABASE_URL`字段用于链接数据库.  
>  npx prisma migrate dev --name init 创建数据库  
>  npx prisma studio 管理数据库

```shell
# 启动一个终端，执行
npm install
npm run start

# 另起一个终端，执行
cd public
npm run start
```
