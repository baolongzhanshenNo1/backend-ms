# Backend Management System (后台管理系统)

一个基于 Vue 3 + Element Plus + Vite 构建的现代化后台管理系统。

## 🚀 技术栈

- **前端框架**: Vue 3 (Composition API)
- **UI 组件库**: Element Plus
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **图表库**: ECharts
- **HTTP 客户端**: Axios
- **Mock 数据**: MockJS
- **样式预处理**: Less
- **代码规范**: ESLint + Prettier

## 📁 项目结构

```
backend-ms/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── api.js         # API 统一管理
│   │   ├── mock.js        # Mock 数据
│   │   ├── permission.js  # 权限相关
│   │   ├── request.js     # 请求拦截器
│   │   └── user.js        # 用户相关接口
│   ├── assets/            # 静态资源
│   │   ├── css/           # 样式文件
│   │   └── image/         # 图片资源
│   ├── components/        # 公共组件
│   │   ├── CommonAside.vue    # 侧边栏组件
│   │   ├── CommonHeader.vue   # 头部组件
│   │   └── CommonMain.vue     # 主体组件
│   ├── config/            # 配置文件
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态管理
│   ├── views/             # 页面组件
│   │   ├── Auth.vue       # 登录/注册页
│   │   ├── Home.vue       # 首页
│   │   ├── Main.vue       # 主布局
│   │   └── User.vue       # 用户管理页
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── index.html             # HTML 模板
├── package.json           # 项目配置
└── vite.config.js         # Vite 配置
```

## 🛠️ 功能特性

- ✅ **用户认证**: 登录/注册功能
- ✅ **权限管理**: 基于角色的权限控制
- ✅ **响应式布局**: 适配不同屏幕尺寸
- ✅ **动态路由**: 支持动态菜单和路由
- ✅ **标签页管理**: 多标签页切换
- ✅ **数据可视化**: 集成 ECharts 图表
- ✅ **Mock 数据**: 开发阶段数据模拟
- ✅ **代码规范**: ESLint + Prettier 代码格式化
- ✅ **状态持久化**: 本地存储用户状态

## 📦 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

## 🚀 开发

```bash
# 启动开发服务器
npm run dev

# 或
yarn dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看项目

## 🏗️ 构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🔧 代码规范

```bash
# 检查代码规范
npm run lint

# 自动修复代码规范问题
npm run lint:fix

# 格式化代码
npm run format

# 检查代码格式
npm run format:check
```

## 🌟 主要页面

- **首页 (`/home`)**: 数据概览和统计图表
- **用户管理 (`/user`)**: 用户信息的增删改查
- **商品管理 (`/goods`)**: 商品信息管理
- **登录页 (`/login`)**: 用户登录
- **注册页 (`/register`)**: 用户注册

## 🔑 路由配置

项目使用 Vue Router 4 进行路由管理，支持：

- 嵌套路由
- 路由守卫
- 动态路由添加
- 路由元信息配置

## 📊 状态管理

使用 Pinia 进行状态管理，包括：

- 用户信息管理
- 菜单状态管理
- 标签页管理
- 权限状态管理

## 🎨 UI 组件

基于 Element Plus 构建，提供：

- 丰富的组件库
- 完整的图标系统
- 响应式设计
- 主题定制支持

## 🔌 API 管理

- 统一的 API 接口管理
- 请求/响应拦截器
- 错误处理机制
- Mock 数据支持

## 📱 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 创建 Pull Request

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
