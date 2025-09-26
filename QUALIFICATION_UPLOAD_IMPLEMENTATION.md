# 资质证明文件上传功能实现

## 功能概述

在landing page项目中，用户填写申请表时提交的资质证明文件现在支持以下功能：

1. **localStorage缓存**：文件在用户选择后立即缓存到localStorage中
2. **R2存储上传**：在用户点击提交申请后，确认登录状态下，根据当前的yaotu_user_id上传到R2
3. **数据库写入**：将R2的URL等相关内容作为guideApplicationData的qualifications写入数据库中

## 实现细节

### 1. 文件缓存到localStorage

- 文件选择后立即转换为base64格式并存储到localStorage
- 存储键名：`yaotu_qualification_files`
- 支持文件描述编辑
- 支持文件删除
- 页面刷新后自动恢复已选择的文件

### 2. R2上传功能

- 在提交申请时，检查用户登录状态（yaotu_user_id）
- 将base64文件转换为Blob并上传到R2存储
- 上传端点：`/api/v2/guide-applications/qualification-upload`
- 支持图片和PDF文件，最大10MB

### 3. 数据库写入

- 上传成功后，将R2的publicUrl写入数据库
- 数据结构：
```json
{
  "qualifications": {
    "certifications": {
      "file_0": {
        "description": "文件描述",
        "proof": "https://pub-7dbef3d9b6794ebf9ef67096f133cce0.r2.dev/guide-qualifications/userId/filename.ext",
        "visible": true
      }
    }
  }
}
```

## 代码修改

### 主要修改文件
- `landing-page/src/pages/BecomeGuidePage.tsx`

### 关键功能
1. **QualificationUploader组件增强**：
   - 支持文件缓存到localStorage
   - 支持文件描述编辑
   - 支持文件删除
   - 显示上传状态

2. **uploadQualificationFiles函数**：
   - 处理文件上传到R2
   - 处理已上传文件的URL复用
   - 错误处理和重试机制

3. **submitToDatabase函数增强**：
   - 在提交前先上传资质文件
   - 将上传后的URL写入数据库
   - 提交成功后清理localStorage缓存

## 使用流程

1. 用户选择资质文件
2. 文件立即缓存到localStorage
3. 用户可以编辑文件描述
4. 用户点击提交申请
5. 系统检查登录状态
6. 上传文件到R2存储
7. 将R2 URL写入数据库
8. 清理localStorage缓存
9. 显示提交成功消息

## 技术特点

- **离线支持**：文件在localStorage中缓存，支持离线编辑
- **断点续传**：已上传的文件不会重复上传
- **错误处理**：完善的错误处理和用户提示
- **类型安全**：TypeScript类型检查
- **性能优化**：base64缓存减少重复读取

## 注意事项

1. 文件大小限制：10MB
2. 支持格式：图片（jpg, png, gif, webp）和PDF
3. 需要用户登录才能上传文件
4. 提交成功后会自动清理缓存
5. 文件上传失败会阻止整个申请提交

## 测试建议

1. 测试文件选择和缓存功能
2. 测试文件描述编辑
3. 测试文件删除功能
4. 测试未登录状态下的行为
5. 测试文件上传失败的处理
6. 测试提交成功后的缓存清理
