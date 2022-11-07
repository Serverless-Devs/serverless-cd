
# serverless-cd 帮助文档

<description>

> ***快速部署一个基于Serverless架构的CICD流水线系统***

</description>

<table>

## 前期准备
需要开通的产品：

- [函数计算FC](https://fcnext.console.aliyun.com/)：整个系统的计算能力运行在FC上
- [日志服务SLS](https://sls.console.aliyun.com/)：分布式日志存储服务，更好的定位和发现问题
- [对象存储OSS](https://oss.console.aliyun.com/)：用于存储日志信息
- [表格存储Tablestore](https://otsnext.console.aliyun.com/): 应用和任务的云数据信息存储


推荐您拥有以下的产品权限 / 策略：
| 服务/业务 | 权限/策略 |
| --- |  --- |
| 函数计算FC |  AliyunFCFullAccess |
| 日志服务SLS |  AliyunLogFullAccess |
| 对象存储OSS |  AliyunOTSFullAccess |
| 表格存储Tablestore |  AliyunOSSFullAccess |

</table>

<codepre id="codepre">

# 代码 & 预览

- [:smiley_cat: 源代码](https://github.com/devsapp/Serverless-Baota)
        
</codepre>

<deploy>

## 部署 & 体验

<appcenter>

- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template=serverless-cd) ，
[![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template=serverless-cd)  该应用。 

</appcenter>

- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
    - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install) ，并进行[授权信息配置](https://www.serverless-devs.com/fc/config) ；
    - 初始化项目：`s init serverless-cd -d serverless-cd`   
    - 进入项目，并进行项目部署：`cd serverless-cd && s deploy -y`

</deploy>

<appdetail id="flushContent">

# 应用详情

本项目的希望将宝塔面板的大部分能力在云函数上实现，让使用者能一键部署面板、创建网站并签发 HTTPS 证书，体验到使用云函数的种种优势：无需固定的服务器费用，网站之间相互隔离，自动扩容等。项目仍处于 DEMO 阶段，当前已具备完整的网站创建、管理和证书签发能力。

一键成功部署后， 会生成两个 url， 其中:

- **宝塔面板的 url 为:**

  `http://baota.baota.123456789.cn-hangzhou.fc.devsapp.net`

  账号为 admin， 密码为您部署应用时设置的密码， 默认为 passwd

  1. 新建一个网站
  ![demo](https://img.alicdn.com/imgextra/i1/O1CN01AckOp31nfB3cKsA8p_!!6000000005116-0-tps-3048-1336.jpg)
  2. 网站设置
  ![](https://img.alicdn.com/imgextra/i3/O1CN01wPYWkZ1FhkLUjLn5p_!!6000000000519-0-tps-2630-1498.jpg)
  3. 管理网站工程
  ![](https://img.alicdn.com/imgextra/i1/O1CN01CFQl5L1t6GZ0evBMY_!!6000000005852-0-tps-2394-650.jpg)

- **kodbox的 url 为:**
  
  `http://kodbox.baota.123456789.cn-hangzhou.fc.devsapp.net`

  1. 部署成功后， 打开 domain url 地址，按照安装指引完整安装（数据库配置选择 PDO），就得到一个 web 版 windows 用户体验的文件管理系统。
 ![](https://img.alicdn.com/imgextra/i2/O1CN01KkJoBE1PbT2w3zmxb_!!6000000001859-2-tps-1034-832.png)
  2. 快捷进入 NAS 根目录管理, 在地址栏输入 `/mnt/auto` （建议添加到收藏）， 即可以实现对 web 工程目录文件管理
  ![](https://img.alicdn.com/imgextra/i1/O1CN013QtzXr1HCGK5I5qh7_!!6000000000721-2-tps-1280-712.png)
  3. 其他 Tips:
   - 进入管理页面后，可以点击左上角的 kod 图标从管理页面返回首页。
   - 如果升级提醒，一般建议直接忽视。

  宝塔面板也可以上传编辑 web 目录文件， 但是能力不强，可以使用 kodbox 完成对 web 工程目录文件更好的管理

项目核心使用到的开源项目有：

- [Serverless Devs](http://www.serverless-devs.com): Serverless 应用全生命周期管理工具
- [mdserver-web](https://github.com/midoks/mdserver-web): 一款简单 Linux 面板服务，使用 BT.CN 的后台管理界面，运行环境为 Python3
- [kodbox](https://github.com/kalcaddle/kodbox): 一个 NAS+OSS UI文件管理系统，详情见 [start-fc-kodbox](https://github.com/devsapp/start-fc-kodbox)
- [acme.sh](https://acme.sh): 自动化签发免费 HTTPS 证书

</appdetail>

<devgroup>

## 开发者社区

您如果有关于错误的反馈或者未来的期待，您可以在 [Serverless Devs repo Issues](https://github.com/serverless-devs/serverless-devs/issues) 中进行反馈和交流。如果您想要加入我们的讨论组或者了解 FC 组件的最新动态，您可以通过以下渠道进行：

<p align="center">

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="130px" > |
|--- | --- | --- |
| <center>微信公众号：`serverless`</center> | <center>微信小助手：`xiaojiangwh`</center> | <center>钉钉交流群：`33947367`</center> | 

</p>

</devgroup>