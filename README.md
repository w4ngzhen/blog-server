# Blog Server

> 基于 GithubApp 机制的博客评论系统后端服务，参考了 [jw-12138/cwgi-api](https://github.com/jw-12138/cwgi-api) 的代码实现
> 本仓库不提供任何部署教程，感兴趣的请直接阅读原作者博文。

本Server作为 Cloudflare worker 部署在 Cloudflare 上。目前包含一个GitHub App 的 callback 接口
以及 GitHub的代理接口。

⚠️ 注意点

部署该Server后，需要在 Cloudflare 上配置以下环境变量：

| 环境变量名称               | 环境变量值                                                      | 是否必选  |
|----------------------|------------------------------------------------------------|-------|
| GH_APP_CLIENT_ID     | 填写 GitHub App 对应 client_id                                 | true  |
| GH_APP_CLIENT_SECRET | 填写 GitHub App 中生成的 client secret                           | true  |
| SITE_URL             | 你的前端站点地址（用于代理的allowedOrigin限制）                             | true  |
| ALLOWED_ORIGINS      | 允许的除SITE_URL外的额外源，多个源使用","隔开                               | false |
| GITHUB_TOKEN         | 个人申请的Github Personal Token, 未提供下代理会有60RPH的限制，添加后可达到5000RPH | false |
