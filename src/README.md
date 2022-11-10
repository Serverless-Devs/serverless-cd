
# serverless-cd 帮助文档

<description>

> ***快速部署一个基于Serverless 架构上的轻量级、易拓展、前端友好的 CI/CD框架**

</description>

<table>

## 前期准备
需要开通的产品：

- [函数计算FC](https://fcnext.console.aliyun.com/)：整个系统的计算能力运行在FC上
- [日志服务SLS](https://sls.console.aliyun.com/)：分布式日志存储服务，用于定位和发现问题
- [对象存储OSS](https://oss.console.aliyun.com/)：用于存储日志信息
- [表格存储Tablestore](https://otsnext.console.aliyun.com/): 应用和任务的元数据信息存储


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

- [:smiley_cat: 源代码](https://github.com/Serverless-Devs/serverless-cd)
        
</codepre>

<deploy>

## 部署 & 体验

<appcenter>

- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template=serverless-cd) ，
[![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template=serverless-cd)  该应用。 

</appcenter>

- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
    - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install) ，并进行[授权信息配置](https://www.serverless-devs.com/fc/config) ；
    注意： CLI版本需要大于 `2.1.7`
    - 初始化项目：`s init serverless-cd -d serverless-cd`   
    - 进入项目，并进行项目部署：`cd serverless-cd && s deploy -y`

</deploy>

<appdetail id="flushContent">

# 应用详情
Serverless-cd 是一款基于 Serverless Devs 开发者工具打造，运行在 Serverless 架构上的轻量级、易拓展、前端友好的 CI/CD框架。通过 Serverless-cd，开发者可以快速打造高性能、低成本的 Serverless CI/CD 能力，并对建设私有化的 Serverless 应用管理平台提供帮助。



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
