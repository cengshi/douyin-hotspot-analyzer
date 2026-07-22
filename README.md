# 📱 抖音热点分析器

实时获取抖音热搜话题、热门视频和创作者信息，生成 Markdown 日报。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)

## ✨ 功能特性

- 🔥 **实时热点** - 获取抖音热搜话题排行榜
- 🎬 **热门视频** - 展示热门视频及互动数据
- 👤 **创作者榜单** - 发现热门创作者信息
- 📄 **Markdown 日报** - 自动生成结构化热点报告
- 🌐 **Web 界面** - 友好的浏览器端操作界面

## 🛠️ 技术栈

**后端**
- Node.js + Express
- TypeScript
- JSON 文件存储

**前端**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

## 🚀 快速开始

### 前置要求

- Node.js >= 18

### 安装

```bash
# 安装所有依赖
npm run install:all
```

### 开发

```bash
# 启动前后端开发服务器
npm run dev
```

访问 http://localhost:3000

- 前端: http://localhost:3000
- 后端 API: http://localhost:4000

### 构建

```bash
# 构建生产版本
npm run build
```

### 启动生产服务

```bash
cd server
npm run build
npm start
```

## 📁 项目结构

```
douyin-hotspot-analyzer/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── api/           # API 客户端
│   │   ├── components/    # React 组件
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── pages/         # 页面组件
│   │   └── types/         # 类型定义
│   └── ...
├── server/                 # 后端服务
│   ├── src/
│   │   ├── services/      # 业务逻辑
│   │   ├── utils/         # 工具函数
│   │   └── types/         # 类型定义
│   └── data/              # 数据存储
├── docs/                   # 文档
│   └── superpowers/        # 设计文档和计划
└── package.json
```

## 📡 API 接口

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/hot/topics` | GET | 获取热搜话题 |
| `/api/hot/videos` | GET | 获取热门视频 |
| `/api/hot/creators` | GET | 获取热门创作者 |
| `/api/hot/refresh` | POST | 刷新热点数据 |
| `/api/docs/today` | GET | 获取今日 Markdown |
| `/api/docs/export` | GET | 导出 Markdown 文件 |

## 🔧 配置

暂无需要配置的选项。项目使用模拟数据进行演示。

## 📝 后续计划

- [ ] 接入真实抖音 API
- [ ] 添加定时刷新功能
- [ ] 支持数据导出为更多格式
- [ ] 添加用户认证

## 📄 License

MIT
