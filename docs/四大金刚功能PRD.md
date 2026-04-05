# 四大金刚功能模块产品需求文档（PRD）

## 文档信息

| 项目名称 | 米夏婚礼小程序 - 四大金刚功能模块 |
|---------|--------------------------------|
| 文档版本 | V1.3 |
| 创建日期 | 2026-03-01 |
| 文档状态 | 待评审 |
| 产品负责人 | 产品灵感 |
| 目标用户 | 准新人、婚礼策划师 |

---

## 一、产品概述

### 1.1 产品背景

"四大金刚"是婚礼行业的专业术语，指婚礼现场的四个核心服务人员：**司仪（主持人）、化妆师、摄影师、摄像师**。这四位专业人员是婚礼顺利举办的关键保障，也是新人最关注的服务内容之一。

目前米夏婚礼小程序已有案例展示、预约管理等基础功能，但缺乏对四大金刚的专项展示和管理。用户无法直观了解每位服务人员的详细信息、档期情况和服务案例，导致预约决策困难，沟通成本高。

### 1.2 产品目标

#### 核心目标
1. **提升服务透明度**：让用户全面了解四大金刚的服务能力、风格和档期
2. **优化预约体验**：简化预约流程，提高预约成功率
3. **提高运营效率**：实现档期数字化管理，减少人工沟通成本
4. **增强用户信任**：通过案例展示，建立服务信任

#### 业务目标
- 四大金刚预约转化率提升 30%
- 用户决策时间缩短 40%
- 档期冲突率降低 60%
- 用户满意度达到 4.5/5.0 以上

### 1.3 产品定位

本功能模块是米夏婚礼小程序的核心服务模块之一，定位为**专业服务人员展示与预约平台**，为用户提供可信赖、可选择的四大金刚服务资源。

---

## 二、用户画像与使用场景

### 2.1 用户画像

#### 主要用户：准新人

**画像A：注重品质的新娘**
- 年龄：25-32岁
- 职业：白领、公务员、教师等
- 特征：对婚礼品质要求高，注重细节，愿意花时间研究服务人员
- 需求：查看服务人员作品、风格，希望找到与自己审美匹配的专业人员
- 痛点：信息不透明，难以判断服务人员真实水平

**画像B：务实的新郎**
- 年龄：27-35岁
- 职业：IT、金融、企业管理等
- 特征：关注效率，希望快速决策
- 需求：了解档期情况，快速完成预约
- 痛点：档期查询需要反复沟通，预约流程繁琐

**画像C：婚礼策划师（管理员）**
- 年龄：23-35岁
- 职业：婚礼策划公司员工/管理者
- 特征：专业用户，熟悉婚礼流程，负责管理四大金刚信息和档期
- 需求：统一管理服务人员信息、设置档期、处理预约
- 痛点：缺乏统一的管理工具，信息更新不及时，档期管理混乱

### 2.2 使用场景

#### 场景1：初次了解四大金刚

**用户**：刚订婚的小李和小王  
**场景**：周末晚上在家，两人一起浏览婚礼小程序  
**需求**：了解四大金刚是什么，各自负责什么工作  
**流程**：
1. 进入首页，点击"四大金刚"入口
2. 浏览四大金刚分类介绍
3. 查看各类别的服务人员列表
4. 点击感兴趣的人员查看详情

#### 场景2：筛选心仪的服务人员

**用户**：新娘小张，已定婚期  
**场景**：午休时间，在办公室用手机浏览  
**需求**：找到符合自己婚礼风格的化妆师  
**流程**：
1. 进入四大金刚页面，选择"化妆师"
2. 筛选条件：擅长风格（韩式）
3. 浏览符合条件的化妆师列表
4. 查看多个化妆师的案例作品
5. 收藏心仪的3位化妆师

#### 场景3：查询档期并预约

**用户**：新郎小陈，婚期已定  
**场景**：晚上下班后，与新娘一起确认预约  
**需求**：确认心仪司仪的档期，完成预约  
**流程**：
1. 进入已收藏的司仪详情页
2. 点击"查看档期"，查看婚期当天是否可预约
3. 确认可预约后，点击"立即预约"
4. 填写预约信息（婚期、婚礼地点、联系方式等）
5. 提交预约，等待确认

#### 场景4：管理我的预约

**用户**：准新娘小刘  
**场景**：婚礼前2个月，需要确认所有服务人员  
**需求**：查看已预约的四大金刚状态  
**流程**：
1. 进入"我的"页面
2. 点击"我的预约"
3. 查看四大金刚预约列表
4. 查看每个预约的状态（待确认/已确认/已完成）
5. 点击详情查看预约详情和联系方式

#### 场景5：婚礼策划师管理档期

**用户**：婚礼策划师小李（管理员）  
**场景**：接到新订单，需要为新人安排四大金刚  
**需求**：查看和设置服务人员的档期  
**流程**：
1. 登录管理后台
2. 进入"档期管理"
3. 选择服务人员，查看档期日历
4. 为可预约日期设置档期状态
5. 确认用户预约，标记档期为已预约

---

## 三、功能需求详细说明

### 3.1 功能架构图

```
四大金刚功能模块
├── 四大金刚展示
│   ├── 分类展示（司仪/化妆师/摄影师/摄像师）
│   ├── 服务人员列表
│   ├── 服务人员详情
│   └── 案例作品展示
├── 档期管理（管理员）
│   ├── 档期日历展示
│   ├── 档期状态标记
│   ├── 档期查询
│   └── 档期冲突提醒
├── 预约功能
│   ├── 在线预约
│   ├── 预约状态管理
│   ├── 预约提醒
│   └── 预约历史
└── 管理后台（婚礼策划师）
    ├── 人员信息管理
    ├── 档期管理
    └── 预约管理
```

### 3.2 功能模块详细说明

#### 模块一：四大金刚展示

##### 1.1 分类入口

**功能描述**：在首页和独立页面提供四大金刚分类入口

**页面元素**：
- 四个分类卡片：司仪、化妆师、摄影师、摄像师
- 每个卡片包含：图标、名称、简介
- 点击卡片进入对应分类的人员列表

**交互逻辑**：
- 卡片支持点击跳转
- 卡片支持长按预览（显示简介）
- 入口位置：首页顶部服务分类区域 + 独立"四大金刚"Tab页

**业务规则**：
- 简介文字不超过20字

##### 1.2 服务人员列表

**功能描述**：展示某一类别的所有服务人员

**页面元素**：
- 筛选栏：擅长风格
- 列表项：头像、姓名、标签、从业年限
- 加载更多：上拉加载

**交互逻辑**：
- 支持按擅长风格筛选
- 点击列表项进入详情页
- 支持收藏功能

**业务规则**：
- 默认按创建时间排序

##### 1.3 服务人员详情页

**功能描述**：展示服务人员的完整信息

**页面元素**：
- 基本信息区：头像、姓名、职称、从业年限
- 标签区：擅长风格、服务特点
- 档期区：可预约档期日历
- 案例作品区：图片/视频作品列表
- 操作区：收藏、立即预约、在线咨询

**交互逻辑**：
- 案例作品支持点击放大查看
- 视频作品支持播放
- 日历支持左右滑动切换月份
- 点击"立即预约"跳转预约页面
- 点击"在线咨询"打开客服对话

**业务规则**：
- 档期日历标记三种状态：可预约（绿色）、已预约（灰色）、不可预约（红色）
- 从业年限自动计算（基于入职日期）

##### 1.4 案例作品展示

**功能描述**：展示服务人员的作品集

**页面元素**：
- 作品分类：全部、图片、视频
- 瀑布流布局
- 作品信息：标题、婚礼日期、婚礼地点

**交互逻辑**：
- 图片支持点击放大、手势缩放
- 视频支持全屏播放
- 支持左右滑动切换作品

**业务规则**：
- 每位服务人员至少展示3个作品
- 作品需审核后才能展示

---

#### 模块二：档期管理

##### 2.1 档期日历展示

**功能描述**：以日历形式展示服务人员的档期情况

**页面元素**：
- 月份切换：左右箭头、当前月份显示
- 星期标题：日、一、二、三、四、五、六
- 日期格子：日期数字、状态标记点
- 图例说明：可预约、已预约、不可预约

**交互逻辑**：
- 左右滑动切换月份
- 点击日期查看当日详情
- 可预约日期可点击选择

**业务规则**：
- 历史日期不可选择
- 已过预约截止日期的日期不可选择
- 档期状态实时更新

##### 2.2 档期状态标记

**功能描述**：标记和管理每个日期的档期状态

**状态类型**：
- **可预约**：该日期空闲，可接受预约
- **已预约**：已有预约，不可再预约
- **不可预约**：个人原因不可服务（如休假、外出等）
- **待确认**：有预约申请，等待确认

**业务规则**：
- 同一服务人员同一日期只能有一个有效预约
- 预约确认后自动标记为"已预约"
- 支持服务人员手动设置不可预约日期

##### 2.3 档期查询

**功能描述**：用户查询服务人员的档期情况

**交互逻辑**：
- 在详情页点击"查看档期"
- 进入档期日历页面
- 选择婚期日期
- 系统返回该日期的可预约状态

**业务规则**：
- 查询结果实时准确
- 支持查询未来12个月的档期
- 查询不产生预约记录

##### 2.4 档期冲突提醒

**功能描述**：当出现档期冲突时提醒相关人员

**触发场景**：
- 用户预约已预约日期
- 服务人员重复确认预约

**提醒方式**：
- 小程序内消息通知
- 微信服务通知（需用户授权）
- 短信通知（需用户授权）

**业务规则**：
- 冲突提醒需在预约提交时即时反馈
- 服务人员确认预约时需二次确认

---

#### 模块三：预约功能

##### 3.1 在线预约

**功能描述**：用户在线预约四大金刚服务

**页面元素**：
- 服务人员信息：头像、姓名、类别
- 婚期选择：日期选择器
- 婚礼地点：地址选择/输入
- 联系人信息：姓名、电话
- 备注信息：特殊需求说明
- 提交按钮

**交互逻辑**：
- 选择婚期时自动校验档期
- 地点支持地图选点
- 支持保存草稿
- 提交前校验必填项

**业务规则**：
- 必填项：婚期、地点、联系人、电话
- 预约提交后状态为"待确认"
- 预约需在48小时内确认，否则自动取消
- 同一用户同一服务人员同一日期只能有一个有效预约

##### 3.2 预约状态管理

**预约状态流转**：

```
待确认 → 已确认 → 服务中 → 已完成
   ↓         ↓
 已取消    已取消
```

**状态说明**：
- **待确认**：预约已提交，等待服务人员确认
- **已确认**：服务人员已确认，等待服务日期
- **服务中**：服务日期当天，正在进行服务
- **已完成**：服务已完成
- **已取消**：预约已取消

**操作权限**：
- 用户：可取消"待确认"和"已确认"状态的预约
- 服务人员：可确认/取消"待确认"状态的预约
- 系统自动：服务日期到达时自动变为"服务中"，服务完成后自动变为"已完成"

##### 3.3 预约提醒

**功能描述**：在关键节点发送提醒通知

**提醒节点**：
- 预约提交成功
- 预约已确认
- 预约即将到期（服务日期前3天、1天）

**提醒方式**：
- 小程序内消息中心
- 微信服务通知
- 短信通知（可选）

##### 3.4 预约历史

**功能描述**：查看历史预约记录

**页面元素**：
- 预约列表：服务人员信息、预约日期、状态
- 筛选：按状态筛选
- 搜索：按服务人员姓名搜索

**交互逻辑**：
- 点击预约项查看详情
- 已取消的预约可重新预约

---

#### 模块四：管理后台（婚礼策划师专用）

##### 4.1 人员信息管理

**功能描述**：婚礼策划师统一管理四大金刚服务人员信息

**管理内容**：
- 基本信息：姓名、职称、联系方式
- 专业信息：从业年限、擅长风格、服务特点
- 作品管理：上传/删除案例作品（图片/视频）
- 状态管理：在职/离职/休假

**操作权限**：
- 婚礼策划师（管理员）：可添加/编辑/删除所有人员信息
- 支持批量导入人员信息
- 支持批量上传作品

##### 4.2 档期管理

**功能描述**：婚礼策划师统一管理所有服务人员的档期

**管理功能**：
- 日历视图：查看所有人员的档期安排
- 按人员筛选：查看特定人员的档期
- 设置不可预约日期：休假、外出等
- 确认预约申请：审核用户预约
- 取消已确认预约：特殊情况处理

**业务规则**：
- 取消预约需提前7天
- 取消预约需填写原因
- 取消后自动通知用户

##### 4.3 预约管理

**功能描述**：管理所有预约记录

**管理功能**：
- 预约列表：查看所有预约
- 预约筛选：按状态、日期、服务人员筛选
- 预约详情：查看预约详细信息
- 预约操作：确认/取消预约

**数据统计**：
- 预约总数
- 待确认数量
- 本月预约数量
- 预约转化率

---

## 四、页面结构和信息架构

### 4.1 页面结构图

```
小程序前端
├── 首页（pages/index/index）
│   └── 四大金刚入口卡片
│
├── 四大金刚模块（pages/vip/）
│   ├── 列表页（pages/vip/list）
│   │   ├── 筛选栏
│   │   ├── 人员列表
│   │   └── 加载更多
│   │
│   ├── 详情页（pages/vip/detail）
│   │   ├── 基本信息区
│   │   ├── 标签区
│   │   ├── 档期日历区
│   │   ├── 案例作品区
│   │   └── 底部操作栏
│   │
│   ├── 档期页（pages/vip/schedule）
│   │   ├── 月份切换
│   │   ├── 日历视图
│   │   └── 图例说明
│   │
│   ├── 预约页（pages/vip/booking）
│   │   ├── 服务人员信息
│   │   ├── 婚期选择
│   │   ├── 地点选择
│   │   ├── 联系信息
│   │   └── 提交按钮
│   │
│   └── 作品详情页（pages/vip/work）
│       ├── 作品展示
│       └── 作品信息
│
├── 我的预约（pages/booking/my）
│   ├── 预约列表
│   └── 预约详情

管理后台（web/）
├── 人员管理
│   ├── 人员列表
│   ├── 人员详情
│   └── 人员编辑
│
├── 档期管理
│   ├── 档期日历
│   └── 档期设置
│
└── 预约管理
    ├── 预约列表
    └── 预约详情
```

### 4.2 信息架构

```
四大金刚
├── 司仪
│   ├── 列表
│   └── 详情
│       ├── 基本信息
│       ├── 档期信息
│       └── 案例作品
│
├── 化妆师
│   ├── 列表
│   └── 详情
│
├── 摄影师
│   ├── 列表
│   └── 详情
│
└── 摄像师
    ├── 列表
    └── 详情
```

---

## 五、详细原型图

### 5.1 四大金刚入口（首页）

```
┌─────────────────────────────────────┐
│  米夏婚礼                    [搜索]  │
├─────────────────────────────────────┤
│                                     │
│  [轮播图区域]                        │
│                                     │
├─────────────────────────────────────┤
│  服务分类                            │
│  ┌─────┬─────┬─────┬─────┐         │
│  │ 司仪 │化妆师│摄影师│摄像师│         │
│  │ 🎤  │ 💄  │ 📷  │ 🎥  │         │
│  └─────┴─────┴─────┴─────┘         │
│                                     │
├─────────────────────────────────────┤
│  精选案例                            │
│  [案例卡片] [案例卡片]               │
│                                     │
└─────────────────────────────────────┘
```

### 5.2 四大金刚列表页

```
┌─────────────────────────────────────┐
│  ←  司仪                      [筛选] │
├─────────────────────────────────────┤
│  [擅长风格 ▼]                        │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ [头像]  王司仪                 │  │
│  │         从业8年                │  │
│  │         擅长：中式、西式       │  │
│  │         [收藏]                 │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [头像]  李司仪                 │  │
│  │         从业6年                │  │
│  │         擅长：户外、创意       │  │
│  │         [收藏]                 │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [头像]  张司仪                 │  │
│  │         从业5年                │  │
│  │         擅长：西式、浪漫       │  │
│  │         [收藏]                 │  │
│  └───────────────────────────────┘  │
│                                     │
│  [加载更多...]                       │
│                                     │
└─────────────────────────────────────┘
```

### 5.3 服务人员详情页

```
┌─────────────────────────────────────┐
│  ←  司仪详情                  [分享] │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │      [大头像]                  │  │
│  │    王司仪 · 首席司仪           │  │
│  │    从业8年                     │  │
│  └───────────────────────────────┘  │
│                                     │
│  擅长风格                            │
│  [中式] [西式] [户外] [创意]         │
│                                     │
├─────────────────────────────────────┤
│  可预约档期                    [查看全部] │
│  ┌─────────────────────────────┐   │
│  │ 日 一 二 三 四 五 六         │   │
│  │        1  2  3  4  5  6      │   │
│  │  7  8  9 10 11 12 13         │   │
│  │ 14 15 16 17 18 19 20         │   │
│  │    ●  ●     ●  ●             │   │
│  └─────────────────────────────┘   │
│  ● 可预约  ● 已预约                 │
│                                     │
├─────────────────────────────────────┤
│  案例作品                      [查看全部] │
│  ┌─────┬─────┬─────┐              │
│  │ [图] │ [图] │ [图] │              │
│  └─────┴─────┴─────┘              │
│                                     │
├─────────────────────────────────────┤
│  [收藏] [在线咨询]    [立即预约]     │
└─────────────────────────────────────┘
```

### 5.4 档期日历页

```
┌─────────────────────────────────────┐
│  ←  档期查询                         │
├─────────────────────────────────────┤
│  王司仪的档期                        │
│                                     │
│     2026年3月              [<] [>]  │
│  ┌─────────────────────────────┐   │
│  │ 日  一  二  三  四  五  六   │   │
│  │  1   2   3   4   5   6   7   │   │
│  │  🟢  🟢  🟢  🟢  🟢  ⚫  ⚫   │   │
│  │  8   9  10  11  12  13  14   │   │
│  │  🟢  🟢  🔴  🟢  🟢  🟢  🟢   │   │
│  │ 15  16  17  18  19  20  21   │   │
│  │ ⚫  🟢  🟢  🟢  🔴  🟢  🟢   │   │
│  │ 22  23  24  25  26  27  28   │   │
│  │  🟢  🟢  🟢  🟢  🟢  🟢  🟢   │   │
│  │ 29  30  31                     │   │
│  │  🟢  🟢  🟢                     │   │
│  └─────────────────────────────┘   │
│                                     │
│  图例说明                            │
│  🟢 可预约  ⚫ 已预约  🔴 不可预约    │
│                                     │
│  已选择：2026年3月15日               │
│  状态：已预约                        │
│                                     │
│  [选择其他日期]  [立即预约]          │
└─────────────────────────────────────┘
```

### 5.5 预约页面

```
┌─────────────────────────────────────┐
│  ←  预约服务                         │
├─────────────────────────────────────┤
│  服务人员                            │
│  ┌───────────────────────────────┐  │
│  │ [头像]  王司仪 · 首席司仪      │  │
│  │         从业8年                │  │
│  └───────────────────────────────┘  │
│                                     │
│  婚礼日期 *                          │
│  ┌───────────────────────────────┐  │
│  │ 2026年3月15日            [选择]│  │
│  └───────────────────────────────┘  │
│                                     │
│  婚礼地点 *                          │
│  ┌───────────────────────────────┐  │
│  │ 北京市朝阳区xxx酒店       [定位]│  │
│  └───────────────────────────────┘  │
│                                     │
│  联系人 *                            │
│  ┌───────────────────────────────┐  │
│  │ 张先生                         │  │
│  └───────────────────────────────┘  │
│                                     │
│  联系电话 *                          │
│  ┌───────────────────────────────┐  │
│  │ 138****8888                    │  │
│  └───────────────────────────────┘  │
│                                     │
│  备注信息                            │
│  ┌───────────────────────────────┐  │
│  │ 希望司仪能多互动...             │  │
│  │                                │  │
│  └───────────────────────────────┘  │
│                                     │
│  [提交预约]                          │
└─────────────────────────────────────┘
```

### 5.6 我的预约列表

```
┌─────────────────────────────────────┐
│  ←  我的预约                         │
├─────────────────────────────────────┤
│  [全部] [待确认] [已确认] [已完成]    │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ [头像]  王司仪                 │  │
│  │ 婚期：2026-03-15              │  │
│  │ 地点：北京市朝阳区xxx酒店      │  │
│  │ 状态：待确认                  │  │
│  │         [取消预约] [查看详情]  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [头像]  李化妆师               │  │
│  │ 婚期：2026-03-15              │  │
│  │ 地点：北京市朝阳区xxx酒店      │  │
│  │ 状态：已确认                  │  │
│  │         [取消预约] [查看详情]  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [头像]  张摄影师               │  │
│  │ 婚期：2026-02-20              │  │
│  │ 地点：北京市海淀区xxx酒店      │  │
│  │ 状态：已完成                  │  │
│  │         [查看详情]            │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### 5.7 管理后台 - 人员管理

```
┌─────────────────────────────────────────────────┐
│  米夏婚礼管理后台                    [管理员] ▼  │
├─────────────────────────────────────────────────┤
│  [人员管理] [档期管理] [预约管理]    │
├─────────────────────────────────────────────────┤
│  人员列表                    [+ 添加人员]       │
│  ┌─────┬──────┬──────┬──────┬──────┬──────┐  │
│  │ 头像│ 姓名  │ 类别  │从业年限│ 状态  │ 操作  │  │
│  ├─────┼──────┼──────┼──────┼──────┼──────┤  │
│  │ [图]│ 王司仪│ 司仪  │  8年  │ 在职  │ 编辑  │  │
│  │ [图]│ 李化妆│ 化妆师│  6年  │ 在职  │ 编辑  │  │
│  │ [图]│ 张摄影│ 摄影师│  5年  │ 在职  │ 编辑  │  │
│  │ [图]│ 刘摄像│ 摄像师│  4年  │ 休假  │ 编辑  │  │
│  └─────┴──────┴──────┴──────┴──────┴──────┘  │
│                                                 │
│  [上一页] 1 2 3 4 5 [下一页]                   │
└─────────────────────────────────────────────────┘
```

---

## 六、数据库设计

### 6.1 数据库集合列表

| 集合名称 | 说明 | 权限 |
|---------|------|------|
| vip_staff | 四大金刚服务人员表 | 仅创建者可写，所有人可读 |
| vip_schedule | 档期表 | 仅创建者可写，所有人可读 |
| vip_bookings | 四大金刚预约表 | 仅创建者可写，所有人可读 |
| vip_works | 作品表 | 仅创建者可写，所有人可读 |

### 6.2 集合详细设计

#### 6.2.1 vip_staff（服务人员表）

```javascript
{
  _id: String,              // 记录ID（自动生成）
  name: String,             // 姓名
  type: String,             // 类型：emcee(司仪)、makeup(化妆师)、photographer(摄影师)、videographer(摄像师)
  title: String,            // 职称：首席、资深、高级
  avatar: String,           // 头像URL
  gender: String,           // 性别：male、female
  phone: String,            // 联系电话
  wechat: String,           // 微信号
  experience: Number,       // 从业年限
  
  // 专业信息
  styles: Array,            // 擅长风格 ['中式', '西式', '户外']
  features: Array,          // 服务特点 ['互动性强', '幽默风趣']
  introduction: String,     // 个人简介
  
  // 状态信息
  status: String,           // 状态：active(在职)、inactive(离职)、vacation(休假)
  sort: Number,             // 排序权重
  
  // 时间戳
  createTime: Date,         // 创建时间
  updateTime: Date,         // 更新时间
  createBy: String,         // 创建人ID
  updateBy: String          // 更新人ID
}
```

**索引设计**：
- `type` + `status`（复合索引）：用于列表查询
- `createTime`（单字段索引）：用于时间排序

#### 6.2.2 vip_schedule（档期表）

```javascript
{
  _id: String,              // 记录ID
  staffId: String,          // 服务人员ID
  staffName: String,        // 服务人员姓名（冗余）
  staffType: String,        // 服务人员类型（冗余）
  
  date: String,             // 日期 YYYY-MM-DD
  status: String,           // 状态：available(可预约)、booked(已预约)、unavailable(不可预约)
  
  // 预约信息（当status为booked时）
  bookingId: String,        // 预约ID
  bookingUser: String,      // 预约用户姓名
  bookingPhone: String,     // 预约用户电话（脱敏）
  
  // 不可预约原因（当status为unavailable时）
  reason: String,           // 原因：休假、外出等
  
  // 时间戳
  createTime: Date,
  updateTime: Date,
  createBy: String,
  updateBy: String
}
```

**索引设计**：
- `staffId` + `date`（复合索引，唯一）：确保同一人员同一日期只有一条记录
- `date`（单字段索引）：用于按日期查询

#### 6.2.3 vip_bookings（预约表）

```javascript
{
  _id: String,              // 记录ID
  bookingNo: String,        // 预约编号（如：BK202603010001）
  
  // 用户信息
  userId: String,           // 用户ID
  userName: String,         // 联系人姓名
  userPhone: String,        // 联系电话
  userAvatar: String,       // 用户头像
  
  // 服务人员信息
  staffId: String,          // 服务人员ID
  staffName: String,        // 服务人员姓名
  staffType: String,        // 服务人员类型
  staffAvatar: String,      // 服务人员头像
  
  // 预约信息
  weddingDate: String,      // 婚礼日期 YYYY-MM-DD
  weddingLocation: String,  // 婚礼地点
  weddingLocationGeo: {     // 地理位置坐标
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  
  // 备注信息
  remark: String,           // 备注信息
  
  // 状态信息
  status: String,           // 状态：pending(待确认)、confirmed(已确认)、serving(服务中)、completed(已完成)、cancelled(已取消)
  cancelReason: String,     // 取消原因
  cancelTime: Date,         // 取消时间
  cancelBy: String,         // 取消人
  
  // 确认信息
  confirmTime: Date,        // 确认时间
  confirmBy: String,        // 确认人
  
  // 完成信息
  completeTime: Date,       // 完成时间
  
  // 时间戳
  createTime: Date,
  updateTime: Date,
  createBy: String,
  updateBy: String
}
```

**索引设计**：
- `userId` + `status`（复合索引）：用于用户查看预约列表
- `staffId` + `status`（复合索引）：用于服务人员查看预约列表
- `weddingDate`（单字段索引）：用于按日期查询
- `bookingNo`（单字段索引，唯一）：预约编号唯一性

#### 6.2.4 vip_works（作品表）

```javascript
{
  _id: String,              // 记录ID
  
  // 服务人员信息
  staffId: String,          // 服务人员ID
  staffName: String,        // 服务人员姓名
  staffType: String,        // 服务人员类型
  
  // 作品信息
  title: String,            // 作品标题
  type: String,             // 作品类型：image(图片)、video(视频)
  url: String,              // 图片/视频URL
  thumbnail: String,        // 缩略图URL（视频）
  
  // 婚礼信息
  weddingDate: String,      // 婚礼日期
  weddingLocation: String,  // 婚礼地点
  weddingStyle: String,     // 婚礼风格
  
  // 描述信息
  description: String,      // 作品描述
  
  // 统计信息
  viewCount: Number,        // 浏览次数
  likeCount: Number,        // 点赞次数
  
  // 审核信息
  auditStatus: String,      // 审核状态
  auditTime: Date,
  auditBy: String,
  
  // 排序和状态
  sort: Number,             // 排序权重
  isVisible: Boolean,       // 是否可见
  
  // 时间戳
  createTime: Date,
  updateTime: Date,
  createBy: String,
  updateBy: String
}
```

**索引设计**：
- `staffId` + `isVisible` + `sort`（复合索引）：用于详情页展示作品列表
- `type`（单字段索引）：用于按类型筛选

### 6.3 数据关系图

```
vip_staff (服务人员)
    ├── 1:N → vip_works (作品)
    ├── 1:N → vip_schedule (档期)
    └── 1:N → vip_bookings (预约)

vip_bookings (预约)
    ├── N:1 → vip_staff (服务人员)
    ├── N:1 → users (用户)
    └── 1:1 → vip_schedule (档期)

vip_works (作品)
    └── N:1 → vip_staff (服务人员)
```

---

## 七、交互流程

### 7.1 用户预约流程

```
开始
  ↓
进入四大金刚列表页
  ↓
选择服务类型（司仪/化妆师/摄影师/摄像师）
  ↓
浏览服务人员列表
  ↓
[筛选/排序] ←─────┐
  ↓               │
点击查看详情       │
  ↓               │
查看服务人员信息   │
  ├─ 基本信息     │
  ├─ 档期情况     │
  ├─ 案例作品     │
  └─ 用户评价     │
  ↓               │
[收藏] ───────────┘
  ↓
点击"查看档期"
  ↓
选择婚期日期
  ↓
判断档期状态
  ├─ 可预约 → 继续
  ├─ 已预约 → 提示"该日期已被预约"
  └─ 不可预约 → 提示"该日期不可预约"
  ↓
点击"立即预约"
  ↓
填写预约信息
  ├─ 婚期（已选择）
  ├─ 婚礼地点
  ├─ 联系人
  ├─ 联系电话
  ├─ 服务套餐
  └─ 备注信息
  ↓
[保存草稿] 或 [提交预约]
  ↓
校验必填项
  ├─ 校验通过 → 继续
  └─ 校验失败 → 提示错误信息
  ↓
提交预约请求
  ↓
创建预约记录（状态：待确认）
  ↓
创建/更新档期记录（状态：待确认）
  ↓
发送通知
  ├─ 用户：预约提交成功
  └─ 管理员：有新的预约申请
  ↓
等待管理员确认
  ↓
管理员确认预约
  ↓
更新预约状态（已确认）
  ↓
更新档期状态（已预约）
  ↓
发送通知
  ├─ 用户：预约已确认
  └─ 管理员：预约确认成功
  ↓
婚礼日期前提醒
  ├─ 前3天提醒
  └─ 前1天提醒
  ↓
婚礼当天
  ↓
更新预约状态（服务中）
  ↓
服务完成
  ↓
更新预约状态（已完成）
  ↓
结束
```

### 7.2 管理员确认预约流程

```
开始
  ↓
管理员收到预约通知
  ↓
进入管理后台预约管理页面
  ↓
查看预约详情
  ├─ 用户信息
  ├─ 婚期信息
  ├─ 地点信息
  └─ 备注信息
  ↓
判断是否接受
  ├─ 接受 → 继续
  └─ 拒绝 → 填写拒绝原因
  ↓
[确认预约] 或 [拒绝预约]
  ↓
确认预约
  ├─ 检查档期是否冲突
  │   ├─ 无冲突 → 继续
  │   └─ 有冲突 → 提示"档期冲突"
  ├─ 更新预约状态（已确认）
  ├─ 更新档期状态（已预约）
  └─ 发送确认通知给用户
  ↓
或
  ↓
拒绝预约
  ├─ 更新预约状态（已取消）
  ├─ 更新档期状态（可预约）
  └─ 发送取消通知给用户
  ↓
结束
```

### 7.3 用户取消预约流程

```
开始
  ↓
用户进入"我的预约"
  ↓
选择要取消的预约
  ↓
判断预约状态
  ├─ 待确认 → 可取消
  ├─ 已确认 → 需提前7天
  │   ├─ 满足条件 → 可取消
  │   └─ 不满足条件 → 提示"需提前7天取消"
  └─ 其他状态 → 不可取消
  ↓
点击"取消预约"
  ↓
填写取消原因
  ↓
确认取消
  ↓
更新预约状态（已取消）
  ↓
更新档期状态（可预约）
  ↓
发送通知
  ├─ 用户：预约已取消
  └─ 管理员：预约已取消
  ↓
结束
```

### 7.4 档期管理流程（管理员）

```
开始
  ↓
管理员进入"档期管理"
  ↓
选择服务人员
  ↓
查看档期日历
  ↓
选择日期
  ↓
判断当前状态
  ├─ 可预约 → 可设置为"不可预约"
  ├─ 已预约 → 查看预约信息
  └─ 不可预约 → 可设置为"可预约"
  ↓
[设置不可预约] 或 [设置可预约]
  ↓
设置不可预约
  ├─ 填写原因
  ├─ 更新档期状态
  └─ 提示成功
  ↓
或
  ↓
设置可预约
  ├─ 更新档期状态
  └─ 提示成功
  ↓
结束
```

---

## 八、技术实现要点

### 8.1 前端实现要点

#### 8.1.1 页面开发

**新增页面**：
```
miniprogram/pages/vip/
├── list/           # 四大金刚列表页
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
├── detail/         # 服务人员详情页
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
├── schedule/       # 档期日历页
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
├── booking/        # 预约页面
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
└── work/           # 作品详情页
    ├── index.js
    ├── index.json
    ├── index.wxml
    └── index.wxss
```

**路由配置**：
```json
{
  "pages": [
    "pages/vip/list",
    "pages/vip/detail",
    "pages/vip/schedule",
    "pages/vip/booking",
    "pages/vip/work"
  ]
}
```

#### 8.1.2 组件开发

**新增组件**：
```
miniprogram/components/
├── vip-card/           # 服务人员卡片组件
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
└── schedule-calendar/  # 档期日历组件
    ├── index.js
    ├── index.json
    ├── index.wxml
    └── index.wxss
```

#### 8.1.3 关键技术点

**1. 日历组件实现**

```javascript
// 生成日历数据
generateCalendar(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const days = [];
  
  // 填充前置空白
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({ type: 'empty' });
  }
  
  // 填充日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      type: 'date',
      date: date,
      day: i,
      status: this.getScheduleStatus(date) // 获取档期状态
    });
  }
  
  return days;
}
```

**2. 瀑布流布局**

```css
/* 使用Flex实现瀑布流 */
.waterfall {
  display: flex;
  flex-direction: row;
  gap: 10rpx;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
```

**3. 图片懒加载**

```html
<image 
  src="{{item.url}}" 
  mode="widthFix" 
  lazy-load="{{true}}"
  bindload="onImageLoad"
/>
```

**4. 视频播放**

```html
<video 
  src="{{videoUrl}}" 
  controls="{{true}}"
  show-center-play-btn="{{true}}"
  enable-progress-gesture="{{true}}"
/>
```

**5. 地图选点**

```javascript
// 选择位置
chooseLocation() {
  wx.chooseLocation({
    success: (res) => {
      this.setData({
        location: res.address,
        locationGeo: {
          type: 'Point',
          coordinates: [res.longitude, res.latitude]
        }
      });
    }
  });
}
```

### 8.2 云函数实现要点

#### 8.2.1 云函数列表

**新增云函数**：
```
cloudfunctions/
├── vipService/         # 四大金刚服务
│   ├── index.js
│   ├── package.json
│   └── config.json
├── scheduleService/    # 档期服务
│   ├── index.js
│   ├── package.json
│   └── config.json
└── vipBookingService/  # 四大金刚预约服务
    ├── index.js
    ├── package.json
    └── config.json
```

#### 8.2.2 关键云函数实现

**1. vipService - 获取服务人员列表**

```javascript
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { type, style, page = 1, pageSize = 10 } = event;
  
  // 构建查询条件
  let query = db.collection('vip_staff').where({
    status: 'active'
  });
  
  // 类型筛选
  if (type) {
    query = query.where({ type });
  }
  
  // 风格筛选
  if (style) {
    query = query.where({
      styles: _.all([style])
    });
  }
  
  // 查询总数
  const countResult = await query.count();
  const total = countResult.total;
  
  // 分页查询
  const listResult = await query
    .orderBy('createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      list: listResult.data,
      total,
      page,
      pageSize
    }
  };
};
```

**2. scheduleService - 查询档期**

```javascript
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { staffId, year, month } = event;
  
  // 构建日期范围
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = month === 12 
    ? `${year + 1}-01-01` 
    : `${year}-${String(month + 1).padStart(2, '0')}-01`;
  
  // 查询档期
  const result = await db.collection('vip_schedule')
    .where({
      staffId,
      date: db.command.gte(startDate).and(db.command.lt(endDate))
    })
    .get();
  
  // 转换为日期状态映射
  const scheduleMap = {};
  result.data.forEach(item => {
    scheduleMap[item.date] = item.status;
  });
  
  return {
    code: 200,
    message: '获取成功',
    data: scheduleMap
  };
};
```

**3. vipBookingService - 创建预约**

```javascript
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { wxContext } = cloud.getWXContext();
  const {
    staffId,
    weddingDate,
    weddingLocation,
    weddingLocationGeo,
    userName,
    userPhone,
    remark
  } = event;
  
  // 开启事务
  const transaction = await db.startTransaction();
  
  try {
    // 1. 检查档期是否可预约
    const scheduleResult = await transaction.collection('vip_schedule')
      .where({
        staffId,
        date: weddingDate
      })
      .get();
    
    if (scheduleResult.data.length > 0) {
      const schedule = scheduleResult.data[0];
      if (schedule.status !== 'available') {
        await transaction.rollback();
        return {
          code: 400,
          message: '该日期不可预约'
        };
      }
    }
    
    // 2. 获取服务人员信息
    const staffResult = await transaction.collection('vip_staff')
      .doc(staffId)
      .get();
    
    if (!staffResult.data) {
      await transaction.rollback();
      return {
        code: 404,
        message: '服务人员不存在'
      };
    }
    
    const staff = staffResult.data;
    
    // 3. 生成预约编号
    const bookingNo = await generateBookingNo();
    
    // 4. 创建预约记录
    const bookingResult = await transaction.collection('vip_bookings')
      .add({
        data: {
          bookingNo,
          userId: wxContext.OPENID,
          userName,
          userPhone,
          staffId,
          staffName: staff.name,
          staffType: staff.type,
          staffAvatar: staff.avatar,
          weddingDate,
          weddingLocation,
          weddingLocationGeo,
          remark,
          status: 'pending',
          isReviewed: false,
          createTime: db.serverDate(),
          updateTime: db.serverDate(),
          createBy: wxContext.OPENID,
          updateBy: wxContext.OPENID
        }
      });
    
    // 5. 创建或更新档期记录
    if (scheduleResult.data.length > 0) {
      await transaction.collection('vip_schedule')
        .doc(scheduleResult.data[0]._id)
        .update({
          data: {
            status: 'pending',
            bookingId: bookingResult._id,
            bookingUser: userName,
            bookingPhone: userPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
            updateTime: db.serverDate(),
            updateBy: wxContext.OPENID
          }
        });
    } else {
      await transaction.collection('vip_schedule')
        .add({
          data: {
            staffId,
            staffName: staff.name,
            staffType: staff.type,
            date: weddingDate,
            status: 'pending',
            bookingId: bookingResult._id,
            bookingUser: userName,
            bookingPhone: userPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
            createTime: db.serverDate(),
            updateTime: db.serverDate(),
            createBy: wxContext.OPENID,
            updateBy: wxContext.OPENID
          }
        });
    }
    
    // 提交事务
    await transaction.commit();
    
    // 发送通知（异步）
    await sendNotification({
      type: 'booking_created',
      bookingId: bookingResult._id,
      userId: wxContext.OPENID,
      staffId
    });
    
    return {
      code: 200,
      message: '预约成功',
      data: {
        bookingId: bookingResult._id,
        bookingNo
      }
    };
    
  } catch (err) {
    await transaction.rollback();
    console.error('创建预约失败:', err);
    return {
      code: 500,
      message: '预约失败，请稍后重试'
    };
  }
};

// 生成预约编号
async function generateBookingNo() {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  
  // 查询当日已有预约数量
  const result = await db.collection('vip_bookings')
    .where({
      bookingNo: db.command.regex(`^BK${dateStr}`)
    })
    .count();
  
  const seq = String(result.total + 1).padStart(4, '0');
  return `BK${dateStr}${seq}`;
}
```

### 8.3 性能优化要点

#### 8.3.1 数据库优化

**1. 索引优化**
- 为常用查询字段创建索引
- 使用复合索引优化多条件查询
- 定期分析慢查询，优化索引

**2. 查询优化**
- 使用 `field` 只查询需要的字段
- 使用 `limit` 限制返回数量
- 避免深层嵌套查询

**3. 数据冗余**
- 在预约表中冗余服务人员基本信息
- 避免频繁的关联查询

#### 8.3.2 缓存策略

**1. 服务人员信息缓存**
```javascript
// 使用小程序本地缓存
const cacheKey = `vip_staff_${staffId}`;
let staffInfo = wx.getStorageSync(cacheKey);

if (!staffInfo) {
  staffInfo = await getStaffInfo(staffId);
  wx.setStorageSync(cacheKey, staffInfo);
}
```

**2. 档期信息缓存**
```javascript
// 缓存当月档期信息
const cacheKey = `schedule_${staffId}_${year}_${month}`;
let schedule = wx.getStorageSync(cacheKey);

if (!schedule) {
  schedule = await getSchedule(staffId, year, month);
  wx.setStorageSync(cacheKey, schedule);
}
```

#### 8.3.3 图片优化

**1. 图片压缩**
```javascript
// 上传前压缩图片
wx.compressImage({
  src: tempFilePath,
  quality: 80,
  success: (res) => {
    // 上传压缩后的图片
    uploadImage(res.tempFilePath);
  }
});
```

**2. 图片CDN**
- 使用云存储CDN加速
- 使用webp格式减小体积

**3. 懒加载**
- 使用 `lazy-load` 属性
- 实现虚拟列表优化长列表性能

### 8.4 安全性要点

#### 8.4.1 数据安全

**1. 敏感信息脱敏**
```javascript
// 手机号脱敏
const phone = '13812345678';
const maskedPhone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
// 结果：138****5678
```

**2. 权限控制**
```json
// 数据库权限配置
{
  "read": true,
  "write": "doc._openid == auth.openid"
}
```

**3. 数据验证**
```javascript
// 服务端验证
function validateBooking(data) {
  if (!data.weddingDate || !data.userName || !data.userPhone) {
    return { valid: false, message: '必填项不能为空' };
  }
  
  if (!/^1[3-9]\d{9}$/.test(data.userPhone)) {
    return { valid: false, message: '手机号格式不正确' };
  }
  
  return { valid: true };
}
```

#### 8.4.2 接口安全

**1. 频率限制**
```javascript
// 使用云函数限流
const rateLimit = require('rate-limiter');

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  
  // 检查频率
  const isLimited = await rateLimit.check(OPENID, 'booking', 10, 60);
  if (isLimited) {
    return {
      code: 429,
      message: '操作过于频繁，请稍后再试'
    };
  }
  
  // 正常业务逻辑
  // ...
};
```

**2. 参数校验**
```javascript
// 严格校验参数
function validateParams(params) {
  const { weddingDate, userName, userPhone } = params;
  
  if (!weddingDate || !userName || !userPhone) {
    return false;
  }
  
  if (!/^1[3-9]\d{9}$/.test(userPhone)) {
    return false;
  }
  
  return true;
}
```

### 8.5 监控与告警

#### 8.5.1 关键指标监控

**1. 业务指标**
- 预约转化率
- 预约成功率
- 用户满意度
- 档期利用率

**2. 技术指标**
- 接口响应时间
- 错误率
- 数据库查询性能
- 云函数执行时间

#### 8.5.2 告警机制

**1. 异常告警**
- 预约失败率超过阈值
- 接口响应时间过长
- 数据库查询超时

**2. 业务告警**
- 档期冲突
- 预约取消率过高
- 用户差评

---

## 九、风险评估与应对

### 9.1 技术风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| 档期并发冲突 | 高 | 中 | 使用数据库事务、乐观锁 |
| 图片上传失败 | 中 | 低 | 压缩图片、重试机制、CDN加速 |
| 云函数超时 | 高 | 低 | 优化查询、分页加载、缓存 |
| 数据库性能瓶颈 | 高 | 低 | 索引优化、分库分表 |

### 9.2 业务风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| 档期管理混乱 | 高 | 中 | 完善档期提醒、自动标记 |
| 用户恶意预约 | 中 | 低 | 实名认证、黑名单机制 |
| 服务人员离职 | 中 | 中 | 及时更新状态、数据归档 |

### 9.3 运营风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| 用户使用率低 | 高 | 中 | 推广宣传、优惠活动 |
| 管理员操作失误 | 中 | 低 | 操作确认、日志记录 |
| 预约取消率高 | 中 | 中 | 提醒机制、违约金 |
| 差评过多 | 高 | 低 | 服务质量监控、及时处理 |

---

## 十、验收标准

### 10.1 功能验收标准

#### 10.1.1 四大金刚展示
- [ ] 首页入口正常显示
- [ ] 分类列表正常加载
- [ ] 筛选功能正常工作
- [ ] 详情页信息完整展示
- [ ] 案例作品正常展示

#### 10.1.2 档期管理
- [ ] 日历正常显示
- [ ] 档期状态正确标记
- [ ] 档期查询准确
- [ ] 档期冲突正确提示

#### 10.1.3 预约功能
- [ ] 预约流程完整
- [ ] 必填项校验正确
- [ ] 预约状态流转正确
- [ ] 预约提醒正常发送

### 10.2 性能验收标准

- [ ] 列表页加载时间 < 1秒
- [ ] 详情页加载时间 < 1.5秒
- [ ] 预约提交时间 < 2秒
- [ ] 图片加载时间 < 500ms
- [ ] 支持1000并发用户

### 10.3 兼容性验收标准

- [ ] iOS系统正常使用
- [ ] Android系统正常使用
- [ ] 微信版本兼容
- [ ] 不同屏幕尺寸适配

### 10.4 安全验收标准

- [ ] 敏感信息已脱敏
- [ ] 权限控制正确
- [ ] 数据验证完整
- [ ] 无安全漏洞

---

## 十一、附录

### 11.1 术语表

| 术语 | 说明 |
|------|------|
| 四大金刚 | 婚礼行业的专业术语，指司仪、化妆师、摄影师、摄像师 |
| 司仪 | 婚礼主持人，负责婚礼现场的流程主持 |
| 化妆师 | 为新娘提供化妆造型的专业人员 |
| 摄影师 | 负责婚礼现场照片拍摄的专业人员 |
| 摄像师 | 负责婚礼现场视频拍摄的专业人员 |
| 档期 | 服务人员的可预约日期 |
| 预约 | 用户预订服务人员的服务 |

### 11.2 参考文档

- 微信小程序官方文档
- 微信云开发官方文档
- 米夏婚礼小程序开发计划
- 婚礼行业服务标准

### 11.3 更新记录

| 版本 | 日期 | 更新内容 | 更新人 |
|------|------|---------|--------|
| V1.0 | 2026-03-01 | 初始版本 | 产品灵感 |
| V1.1 | 2026-03-01 | 简化流程：移除服务人员自助管理功能，由婚礼策划师（管理员）统一管理 | 产品灵感 |
| V1.2 | 2026-03-01 | 精简展示：移除服务人数、评分、价格、案例数量等字段 | 产品灵感 |
| V1.3 | 2026-03-01 | 移除评价系统、开发周期、增强版本规划 | 产品灵感 |

---

**文档结束**

本文档为米夏婚礼小程序"四大金刚"功能模块的完整产品需求文档，涵盖产品概述、用户画像、功能需求、页面设计、数据库设计、交互流程、技术实现等各个方面，为开发团队提供清晰的实现指导。

**核心设计理念**：由婚礼策划师（管理员）统一管理四大金刚的人员信息、档期和预约，简化流程，提高运营效率。
