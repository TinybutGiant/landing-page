# 图片使用说明

## 🖼️ 动态图片扫描功能

现在 CursorFollow 组件可以自动扫描 `public` 文件夹中的所有图片，无需手动配置！

### 📁 支持的图片格式
- **JPG/JPEG** - 最常见的图片格式
- **PNG** - 支持透明背景
- **WebP** - 现代高效格式
- **GIF** - 动态图片
- **SVG** - 矢量图片

### 🎯 自动识别的文件名模式

系统会自动扫描以下文件名模式：

#### 数字模式
```
1.jpg, 2.jpg, 3.jpg, ..., 10.jpg
01.jpg, 02.jpg, 03.jpg, ..., 10.jpg
```

#### 常见名称
```
test.jpg, avatar.jpg, profile.jpg, user.jpg, person.jpg
img.jpg, image.jpg, photo.jpg, pic.jpg, picture.jpg
headshot.jpg, face.jpg, head.jpg, mugshot.jpg
```

#### 变体名称
```
avatar1.jpg, avatar2.jpg, user1.jpg, user2.jpg
profile1.jpg, profile2.jpg, headshot1.jpg, headshot2.jpg
```

### 🚀 使用方法

#### 1. 直接放入图片
只需将图片文件放入 `public` 文件夹，系统会自动检测：

```
public/
├── 1.jpg          ✅ 自动检测
├── 2.jpg          ✅ 自动检测
├── avatar.png     ✅ 自动检测
├── profile.jpg    ✅ 自动检测
├── test.jpg       ✅ 自动检测
└── user1.png      ✅ 自动检测
```

#### 2. 手动指定图片（可选）
如果不想使用自动扫描，可以手动传入图片数组：

```tsx
<CursorFollow 
  images={[
    '/custom1.jpg',
    '/custom2.jpg',
    '/custom3.jpg'
  ]} 
/>
```

### 🔧 技术实现

#### Vite import.meta.glob 方案
1. **构建时扫描** - 使用 Vite 的 `import.meta.glob` 在构建时自动收集所有图片
2. **零运行时开销** - 不需要运行时的 fetch 请求
3. **类型安全** - 完整的 TypeScript 支持
4. **自动优化** - Vite 自动处理图片优化和缓存

#### 性能优势
- **构建时处理** - 图片路径在构建时就确定，无需运行时检查
- **零网络请求** - 不需要 fetch 请求检查文件是否存在
- **自动优化** - Vite 自动处理图片压缩和缓存
- **类型安全** - 完整的 TypeScript 类型支持

### 📊 构建日志

在构建时可以看到 Vite 自动处理的图片：

```
dist/assets/1-Bt0jpDm4.jpg       269.11 kB
dist/assets/2-xcE9I6mf.jpg       64.30 kB
dist/assets/3-DHadNc04.jpg      275.28 kB
dist/assets/4-NKoAPM62.jpg       400.56 kB
dist/assets/5-B7iv4eX5.jpg        97.89 kB
```

### 🎯 运行时日志

在浏览器控制台中可以看到：

```
使用 Vite glob 找到 5 张本地图片: ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg", "/5.jpg"]
[SEQUENTIAL] 显示图片 1/5: /1.jpg
[SEQUENTIAL] 显示图片 2/5: /2.jpg
```

### 🎨 默认图片

如果没有找到本地图片，系统会使用高质量的 Unsplash 头像作为默认图片：

- 多样化的人像
- 高质量图片
- 统一的尺寸 (150x150)
- 自动裁剪为正方形

### 🔄 重新扫描

如果需要重新扫描图片（比如添加了新图片），可以调用：

```typescript
const scanner = DynamicImageScanner.getInstance();
await scanner.rescan(); // 重新扫描
```

### 💡 最佳实践

1. **命名规范** - 使用简单的数字或描述性名称
2. **文件大小** - 建议图片大小在 50KB 以内
3. **尺寸比例** - 建议使用正方形图片 (1:1)
4. **格式选择** - JPG 用于照片，PNG 用于透明背景

### 🐛 故障排除

#### 图片不显示？
1. 检查文件名是否符合模式
2. 确认图片在 `public` 文件夹中
3. 检查浏览器控制台是否有错误
4. 确认图片格式是否支持

#### 性能问题？
1. 图片文件过大 - 建议压缩图片
2. 图片数量过多 - 建议控制在 10 张以内
3. 网络问题 - 检查网络连接

### 🔄 循环模式

现在支持三种循环模式：

#### 1. 顺序循环（默认）
```tsx
<CursorFollow 
  containerSelector="#hero-section" 
  cycleMode="sequential"
  showDebugInfo={true}
/>
```
- 图片按顺序显示：1.jpg → 2.jpg → 3.jpg → 1.jpg → ...

#### 2. 随机循环
```tsx
<CursorFollow 
  containerSelector="#hero-section" 
  cycleMode="random"
  showDebugInfo={true}
/>
```
- 图片随机显示，每次都可能不同

#### 3. 反向循环
```tsx
<CursorFollow 
  containerSelector="#hero-section" 
  cycleMode="reverse"
  showDebugInfo={true}
/>
```
- 图片反向显示：3.jpg → 2.jpg → 1.jpg → 3.jpg → ...

### 📝 示例配置

#### 基本使用（顺序循环）
```tsx
// 自动扫描 public 文件夹，按顺序循环显示
<CursorFollow containerSelector="#hero-section" />
```

#### 手动指定图片
```tsx
// 手动指定图片，随机循环
<CursorFollow 
  images={['/avatar1.jpg', '/avatar2.jpg', '/avatar3.jpg']}
  containerSelector="#hero-section"
  cycleMode="random"
  showDebugInfo={true}
/>
```

#### 调试模式
```tsx
// 启用调试信息，在控制台查看图片循环
<CursorFollow 
  containerSelector="#hero-section" 
  cycleMode="sequential"
  showDebugInfo={true}
/>
```

### 🐛 调试信息

启用 `showDebugInfo={true}` 后，控制台会显示：

```
[SEQUENTIAL] 显示图片 1/5: /1.jpg
[SEQUENTIAL] 显示图片 2/5: /2.jpg
[SEQUENTIAL] 显示图片 3/5: /3.jpg
[RANDOM] 显示图片 4/5: /5.jpg
[RANDOM] 显示图片 1/5: /1.jpg
```

现在你只需要将图片放入 `public` 文件夹，系统就会自动检测并使用它们！🎉
