
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

部署完成后会生成一个对应的测试域名，格式为`auto.serverless-cd.${uid}.{region}.fc.devsapp.net`
<a name="h4bK9"></a>
## 快速体验
<a name="IvtR1"></a>
#### 访问控制台： 
`auto.serverless-cd.${uid}.{region}.fc.devsapp.net`
<a name="wU2X0"></a>
#### 创建应用：

   - 添加授权<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/22111491/1668063809412-b0292502-aff4-4397-9eae-404b440e65a5.png#averageHue=%23fafafa&clientId=uf225b962-d843-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=696&id=Oy3Wp&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1392&originWidth=2346&originalType=binary&ratio=1&rotation=0&showTitle=false&size=223792&status=done&style=none&taskId=ue681ad6b-848b-4d5f-a13c-418056e4507&title=&width=1173)

![image.png](https://cdn.nlark.com/yuque/0/2022/png/22111491/1668063886561-b378b5e3-44a9-4aa4-b2a2-00c763b74ba5.png#averageHue=%23f7f7f7&clientId=uf225b962-d843-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=279&id=sBA9W&margin=%5Bobject%20Object%5D&name=image.png&originHeight=558&originWidth=1220&originalType=binary&ratio=1&rotation=0&showTitle=false&size=52766&status=done&style=none&taskId=u1aa146d9-1996-4864-bae4-8ac3fedde86&title=&width=610)

   - 获取Token<br />在对应[GitHub setting](https://github.com/settings/tokens)页面，添加个人Token，并填入

![s_token.gif](https://cdn.nlark.com/yuque/0/2022/gif/22111491/1668064404553-2bb7835b-1257-4ad1-bfff-a579b1133083.gif#averageHue=%23000000&clientId=uf225b962-d843-4&crop=0&crop=0&crop=1&crop=1&from=drop&id=uf0089dd3&margin=%5Bobject%20Object%5D&name=s_token.gif&originHeight=680&originWidth=1161&originalType=binary&ratio=1&rotation=0&showTitle=false&size=951606&status=done&style=none&taskId=uaf1d2c4a-bae2-4fd2-ba17-c953282831e&title=)

   - 导入应用:
      - 选择nodejs模版应用: [https://github.com/serverless-cd-demo/nodejs-ci](https://github.com/serverless-cd-demo/nodejs-ci)，并fork到当前账号

![s_demo.gif](https://cdn.nlark.com/yuque/0/2022/gif/22111491/1668064760983-0a45cac3-ff0e-4794-b622-c642fc9d3d02.gif#averageHue=%23000000&clientId=uf225b962-d843-4&crop=0&crop=0&crop=1&crop=1&from=drop&height=364&id=Nmi1M&margin=%5Bobject%20Object%5D&name=s_demo.gif&originHeight=663&originWidth=1161&originalType=binary&ratio=1&rotation=0&showTitle=false&size=1774659&status=done&style=none&taskId=u123abe95-418b-4b53-9569-43cfd41a64c&title=&width=638)

   - 创建应用

![image.png](https://cdn.nlark.com/yuque/0/2022/png/22111491/1668064987688-8b202fc0-174a-4e26-a0c8-f012691aba40.png#averageHue=%23faf8f8&clientId=uf225b962-d843-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=424&id=u4edae3f6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1524&originWidth=2346&originalType=binary&ratio=1&rotation=0&showTitle=false&size=222266&status=done&style=none&taskId=ucbe35cf0-160a-4f5a-be93-414e08c0bcf&title=&width=652)

3. 查看应用详情

可以看到刚创建的应用已经触发部署<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/22111491/1668065107301-8a32ca13-a302-43a7-8ffa-38a6b1816558.png#averageHue=%23fafafa&clientId=uf225b962-d843-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=687&id=u177f3e1f&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1374&originWidth=1984&originalType=binary&ratio=1&rotation=0&showTitle=false&size=128563&status=done&style=none&taskId=u968b97fa-8998-4265-8017-7182a176bff&title=&width=992)<br />并且可以看到详细的部署日志信息<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/22111491/1668065144073-2952541b-c2f2-4e45-b3fe-9459622ec937.png#averageHue=%23999999&clientId=uf225b962-d843-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=541&id=u3f634eda&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1082&originWidth=2004&originalType=binary&ratio=1&rotation=0&showTitle=false&size=99798&status=done&style=none&taskId=ue3646785-81e4-4822-87ba-980ec8ce34c&title=&width=1002)

<a name="hZVXq"></a>
#### webhook触发部署
修改代码并且提交，查看自动化执行部署构建流程<br />![s_redeploy.gif](https://cdn.nlark.com/yuque/0/2022/gif/22111491/1668065492165-0210010f-1138-4b89-9f7a-1ca0036d1f73.gif#averageHue=%23000000&clientId=uc43ce293-3493-4&crop=0&crop=0&crop=1&crop=1&from=drop&id=udae1dff0&margin=%5Bobject%20Object%5D&name=s_redeploy.gif&originHeight=682&originWidth=1161&originalType=binary&ratio=1&rotation=0&showTitle=false&size=2127570&status=done&style=none&taskId=u85188504-47be-4bf9-afe2-7141a04bea6&title=)


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
