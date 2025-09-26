# 申请提交流程实现说明

## 概述

在landing page项目中，用户点击提交申请后，系统会按照以下三个步骤执行：

1. **上传资质文件，更新需要写入数据库的guideApplicationData**
2. **写入数据库**
3. **上传PDF，并更新对应的application的internal tags**

所有路由API都使用相对路径，通过vite代理转发到主项目。

## 实现详情

### 步骤1: 资质文件上传

**位置**: `src/pages/BecomeGuidePage.tsx` - `uploadQualificationFiles` 函数

**功能**:
- 检查用户是否已登录
- 遍历资质文件，将base64数据转换为Blob
- 通过 `/api/v2/guide-applications/qualification-upload` 端点上传到R2存储
- 返回包含publicUrl的资质信息，用于更新guideApplicationData

**API端点**: `POST /api/v2/guide-applications/qualification-upload`
- 使用相对路径，通过vite代理转发
- 需要Bearer token认证
- 支持多种文件格式（图片、PDF等）

### 步骤2: 数据库写入

**位置**: `src/pages/BecomeGuidePage.tsx` - `submitToDatabase` 函数

**功能**:
- 构建完整的申请数据，包含处理后的资质文件信息
- 通过 `/api/v2/guide-applications` 端点写入数据库
- 返回申请ID用于后续PDF上传

**API端点**: `POST /api/v2/guide-applications`
- 使用相对路径，通过vite代理转发
- 需要Bearer token认证
- 数据包含所有表单字段和资质文件URL

### 步骤3: PDF上传并更新internal tags

**位置**: `src/pages/BecomeGuidePage.tsx` - `uploadPDFToR2` 函数

**功能**:
- 使用申请ID生成PDF
- 通过 `/api/v2/guide-applications/{applicationId}/archive-pdf` 端点上传PDF到R2
- 自动更新application的internal tags，添加PDF URL

**API端点**: `POST /api/v2/guide-applications/{id}/archive-pdf`
- 使用相对路径，通过vite代理转发
- 需要Bearer token认证
- 接收PDF buffer数据
- 自动更新internal tags

## API路由配置

### Vite代理配置

**文件**: `vite.config.ts`

```typescript
server: {
  proxy: {
    "/api": {
      target: "https://ahhh-yaotu.onrender.com",
      changeOrigin: true,
      secure: true,
    },
  },
}
```

### 所有API调用都使用相对路径

- ✅ `/api/v2/guide-applications/qualification-upload`
- ✅ `/api/v2/guide-applications`
- ✅ `/api/v2/guide-applications/{id}/archive-pdf`
- ✅ `/api/v2/service-categories/with-subcategories`
- ✅ `/api/auth/signup`
- ✅ `/api/auth/login`
- ✅ `/api/auth/check-username`

## 错误处理

### 步骤1错误处理
- 文件上传失败时，整个申请流程会停止
- 显示具体错误信息给用户

### 步骤2错误处理
- 数据库写入失败时，整个申请流程会停止
- 特殊处理401认证错误，自动跳转登录页面

### 步骤3错误处理
- PDF上传失败不会影响申请提交
- 记录错误日志，但申请仍然成功

## 数据流程

```
用户提交申请
    ↓
步骤1: 上传资质文件到R2
    ↓ (成功)
步骤2: 写入数据库，获取申请ID
    ↓ (成功)
步骤3: 生成PDF并上传到R2，更新internal tags
    ↓ (完成)
显示成功消息，清除localStorage
```

## 技术实现要点

1. **相对路径**: 所有API调用都使用相对路径，通过vite代理转发
2. **认证**: 所有API调用都需要Bearer token认证
3. **文件上传**: 支持base64到Blob的转换，直接上传到R2
4. **错误处理**: 分步骤错误处理，确保数据一致性
5. **状态管理**: 使用localStorage缓存用户数据，提交成功后清除

## 测试建议

1. 测试完整申请流程（包含资质文件）
2. 测试无资质文件的申请流程
3. 测试网络错误情况下的错误处理
4. 测试认证失败的情况
5. 测试PDF生成失败的情况
