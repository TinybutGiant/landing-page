# Ahhh Yaotu Landing Page

独立的入驻申请页面，专为 Ahhh Yaotu 平台设计。

## 🚀 特性

- ✨ 精美的动画效果和交互体验
- 🎨 响应式设计，支持移动端和桌面端
- 🎯 优化的表单验证和用户体验
- 🌈 现代化的 UI 设计
- ⚡ 基于 Vite 的快速构建

## 🛠️ 技术栈

- **React 18** - 现代化的 React 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Framer Motion** - 强大的动画库
- **Radix UI** - 无障碍的 UI 组件
- **Lucide React** - 精美的图标库

## 📦 安装和运行

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 部署

#### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置构建命令：`npm run build`
4. 配置输出目录：`dist`

#### Netlify 部署

1. 将代码推送到 GitHub
2. 在 Netlify 中连接 GitHub 仓库
3. 配置构建命令：`npm run build`
4. 配置发布目录：`dist`

#### Cloudflare Pages 部署

1. 将代码推送到 GitHub
2. 在 Cloudflare Pages 中连接 GitHub 仓库
3. 配置构建命令：`npm run build`
4. 配置输出目录：`dist`

## 🎨 自定义

### 主题色彩

主要品牌色彩在 `tailwind.config.js` 中定义：

```javascript
colors: {
  primary: "#FFD511", // 主品牌色
  secondary: "#FFA500", // 辅助色
}
```

### 动画配置

动画效果在 `src/App.tsx` 中配置，使用 Framer Motion 实现。

## 📱 响应式设计

- **移动端**: < 768px
- **平板端**: 768px - 1024px  
- **桌面端**: > 1024px

## 🔧 开发指南

### 项目结构

```
src/
├── components/          # 组件目录
│   ├── ui/            # UI 基础组件
│   ├── AnimationDemo.tsx
│   └── CursorFollow.tsx
├── lib/               # 工具函数
│   └── utils.ts
├── App.tsx            # 主应用组件
├── main.tsx           # 应用入口
└── index.css          # 全局样式
```

### 添加新功能

1. 在 `src/components/` 中创建新组件
2. 在 `src/App.tsx` 中导入和使用
3. 使用 Tailwind CSS 进行样式设计
4. 使用 Framer Motion 添加动画效果

## 🚀 性能优化

- 代码分割和懒加载
- 图片优化和压缩
- CSS 和 JS 的压缩
- 静态资源缓存

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系

如有问题，请联系开发团队。
