# Guide Form Package

这是一个包含PDF生成功能的React组件包，基于html2pdf.js实现。

## 功能特性

- 📄 PDF生成：将HTML内容转换为PDF
- 📥 PDF下载：自动下载生成的PDF文件
- ☁️ PDF上传：将PDF上传到服务器
- 🎨 自定义样式：支持自定义PDF样式和选项
- 🔧 易于集成：提供React组件和Hook

## 安装

```bash
npm install @replit/guide-form
```

## 依赖

- `html2pdf.js`: PDF生成库
- `react`: React框架

## 使用方法

### 1. 使用PrintAndSave组件

```tsx
import { PrintAndSave } from '@replit/guide-form';

function MyComponent() {
  return (
    <PrintAndSave
      applicationId="app-123"
      token="your-auth-token"
      uploadUrl="/api/upload-pdf"
      elementId="print-root"
      onSuccess={(fileKey) => console.log('PDF uploaded:', fileKey)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

### 2. 使用usePDFGeneration Hook

```tsx
import { usePDFGeneration } from '@replit/guide-form';

function MyComponent() {
  const { downloadPDF, isProcessing } = usePDFGeneration({
    onSuccess: () => console.log('PDF generated!'),
    onError: (error) => console.error('Error:', error),
  });

  const handleDownload = () => {
    downloadPDF("print-root", {
      filename: "my-document.pdf",
    });
  };

  return (
    <button onClick={handleDownload} disabled={isProcessing}>
      {isProcessing ? "生成中..." : "下载PDF"}
    </button>
  );
}
```

### 3. 使用工具函数

```tsx
import { 
  generatePDFBlob, 
  downloadPDF, 
  uploadPDF,
  generateDownloadAndUploadPDF 
} from '@replit/guide-form';

// 生成PDF Blob
const pdfBlob = await generatePDFBlob("print-root", {
  filename: "document.pdf",
  margin: [12, 12, 12, 12],
});

// 下载PDF
await downloadPDF("print-root", {
  filename: "document.pdf",
});

// 上传PDF
const fileKey = await uploadPDF(pdfBlob, {
  applicationId: "app-123",
  token: "auth-token",
  uploadUrl: "/api/upload",
});

// 生成、下载并上传PDF
const fileKey = await generateDownloadAndUploadPDF(
  "print-root",
  {
    applicationId: "app-123",
    token: "auth-token",
    uploadUrl: "/api/upload",
  },
  {
    filename: "document.pdf",
  }
);
```

## API 参考

### PrintAndSave 组件

| 属性 | 类型 | 必需 | 描述 |
|------|------|------|------|
| applicationId | string | ✅ | 申请ID |
| token | string | ✅ | 认证令牌 |
| uploadUrl | string | ✅ | 上传URL |
| elementId | string | ❌ | 要转换的DOM元素ID (默认: "print-root") |
| pdfOptions | PDFOptions | ❌ | PDF生成选项 |
| onSuccess | (fileKey: string) => void | ❌ | 成功回调 |
| onError | (error: Error) => void | ❌ | 错误回调 |
| className | string | ❌ | 自定义CSS类 |
| children | ReactNode | ❌ | 自定义按钮内容 |
| disabled | boolean | ❌ | 是否禁用 |

### usePDFGeneration Hook

```tsx
const {
  isProcessing,      // 是否正在处理
  generatePDF,        // 生成PDF Blob
  downloadPDF,        // 下载PDF
  uploadPDF,          // 上传PDF
  downloadAndUploadPDF // 下载并上传PDF
} = usePDFGeneration({
  onSuccess?: (fileKey?: string) => void,
  onError?: (error: Error) => void,
});
```

### PDFOptions 接口

```tsx
interface PDFOptions {
  margin?: number | [number, number] | [number, number, number, number];
  filename?: string;
  image?: {
    type?: "jpeg" | "png" | "webp";
    quality?: number;
  };
  html2canvas?: {
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    backgroundColor?: string;
  };
  jsPDF?: {
    unit?: string;
    format?: string;
    orientation?: string;
    compress?: boolean;
  };
  pagebreak?: {
    mode?: string[];
  };
}
```

## 默认配置

```tsx
const defaultPDFOptions = {
  margin: [12, 12, 12, 12], // 12mm margins
  filename: "guide-application.pdf",
  image: { type: "jpeg", quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
  },
  jsPDF: {
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
  },
  pagebreak: { mode: ["avoid-all"] },
};
```

## 注意事项

1. 确保目标DOM元素存在且有内容
2. 上传功能需要服务器端支持
3. PDF生成是异步操作，请处理加载状态
4. 建议在生产环境中测试PDF生成功能

## 示例

查看 `landing-page/src/pages/PDFTestPage.tsx` 获取完整的使用示例。
