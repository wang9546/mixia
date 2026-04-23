# Mixia 婚庆服务小程序

## 项目简介
Mixia 是一款提供高端定制婚庆服务的小程序，集成了婚纱摄影、现场布置、婚车租赁以及四大金刚（司仪、化妆、摄影、摄像）等核心婚嫁业务的展示与咨询功能。
项目整体采用高级杂志风（Editorial/Luxury）的视觉设计，为用户带来极具质感的备婚体验。

## 核心模块
本项目的代码按模块进行了清晰的划分，每个子模块均包含详细的 `README.md`，主要结构如下：

### 前端模块 (`miniprogram/pages`)
- [首页模块 (`index`)](./miniprogram/pages/index/README.md)
- [婚纱摄影模块 (`dress`)](./miniprogram/pages/dress/README.md)
- [现场布置模块 (`decoration`)](./miniprogram/pages/decoration/README.md)
- [婚车租赁模块 (`car`)](./miniprogram/pages/car/README.md)
- [四大金刚模块 (`vendor`)](./miniprogram/pages/vendor/README.md)
- [用户中心模块 (`user`)](./miniprogram/pages/user/README.md)
- [联系客服模块 (`contact`)](./miniprogram/pages/contact/README.md)

### 后端云服务 (`cloudfunctions`)
- [云函数模块](./cloudfunctions/README.md)：包含 `getHomeData`、`getModuleList`、`getModuleDetail` 等微信云开发后端逻辑。

## 技术栈
- 框架：微信小程序原生开发
- 后端：微信云开发（CloudBase：云函数 + 云数据库）
- 设计风格：Glassmorphism (毛玻璃) + Editorial (杂志化排版) + 高定色调 (Beige & Gold)

## 运行指引
1. 使用 **微信开发者工具** 导入本项目根目录。
2. 在 `project.config.json` 中配置你自己的 `appid`。
3. 开通微信云开发，并配置云环境 ID。
4. 部署 `cloudfunctions` 下的所有云函数。
5. 右键运行 `initDatabase` 云函数，完成数据库初始化。
