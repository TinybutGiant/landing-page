import html2pdf from "html2pdf.js";

export interface PDFOptions {
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

export interface PDFUploadOptions {
  applicationId: string;
  token: string;
  uploadUrl: string;
}

export const defaultPDFOptions: PDFOptions = {
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

/**
 * 生成PDF Blob
 * @param elementId - 要转换为PDF的DOM元素ID
 * @param options - PDF生成选项
 * @returns Promise<Blob> - PDF文件的Blob对象
 */
export async function generatePDFBlob(
  elementId: string,
  options: PDFOptions = {}
): Promise<Blob> {
  const printRoot = document.getElementById(elementId);
  if (!printRoot) {
    throw new Error(`Element with ID '${elementId}' not found`);
  }

  if (!printRoot.textContent?.trim()) {
    throw new Error("Element content is empty");
  }

  const mergedOptions = { ...defaultPDFOptions, ...options } as any;
  
  console.log("🔄 开始生成PDF...", { elementId, options: mergedOptions });
  
  const pdfWorker = html2pdf().set(mergedOptions).from(printRoot);
  const pdfBlob = await pdfWorker.outputPdf("blob");
  
  console.log("📥 PDF生成完成，大小:", pdfBlob.size, "bytes");
  
  if (pdfBlob.size === 0) {
    throw new Error("Generated PDF file is empty");
  }
  
  return pdfBlob;
}

/**
 * 下载PDF文件
 * @param pdfBlob - PDF文件的Blob对象
 * @param filename - 下载的文件名
 */
export function downloadPDF(pdfBlob: Blob, filename: string): void {
  const downloadUrl = URL.createObjectURL(pdfBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = downloadUrl;
  downloadLink.download = filename;
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  // 清理URL对象
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

/**
 * 上传PDF到服务器
 * @param pdfBlob - PDF文件的Blob对象
 * @param options - 上传选项
 * @returns Promise<string> - 上传成功后的文件key
 */
export async function uploadPDF(
  pdfBlob: Blob,
  options: PDFUploadOptions
): Promise<string> {
  const { applicationId, token, uploadUrl } = options;
  
  console.log("📤 开始上传PDF到服务器...", {
    size: pdfBlob.size,
    applicationId,
    uploadUrl,
  });
  
  const pdfArrayBuffer = await pdfBlob.arrayBuffer();
  
  const requestHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/pdf",
    "Content-Length": pdfArrayBuffer.byteLength.toString(),
  };
  
  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: requestHeaders,
    body: pdfArrayBuffer,
  });
  
  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    console.error("📤 PDF上传失败:", {
      status: uploadResponse.status,
      statusText: uploadResponse.statusText,
      responseText: errorText,
    });
    throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
  }
  
  const uploadResult = await uploadResponse.json();
  console.log("✅ PDF上传成功:", uploadResult.key);
  
  return uploadResult.key;
}

/**
 * 生成PDF并下载
 * @param elementId - 要转换为PDF的DOM元素ID
 * @param options - PDF生成选项
 */
export async function generateAndDownloadPDF(
  elementId: string,
  options: PDFOptions = {}
): Promise<void> {
  const pdfBlob = await generatePDFBlob(elementId, options);
  const filename = options.filename || "guide-application.pdf";
  downloadPDF(pdfBlob, filename);
}

/**
 * 生成PDF并上传到服务器
 * @param elementId - 要转换为PDF的DOM元素ID
 * @param uploadOptions - 上传选项
 * @param pdfOptions - PDF生成选项
 * @returns Promise<string> - 上传成功后的文件key
 */
export async function generateAndUploadPDF(
  elementId: string,
  uploadOptions: PDFUploadOptions,
  pdfOptions: PDFOptions = {}
): Promise<string> {
  const pdfBlob = await generatePDFBlob(elementId, pdfOptions);
  return await uploadPDF(pdfBlob, uploadOptions);
}

/**
 * 生成PDF、下载并上传到服务器
 * @param elementId - 要转换为PDF的DOM元素ID
 * @param uploadOptions - 上传选项
 * @param pdfOptions - PDF生成选项
 * @returns Promise<string> - 上传成功后的文件key
 */
export async function generateDownloadAndUploadPDF(
  elementId: string,
  uploadOptions: PDFUploadOptions,
  pdfOptions: PDFOptions = {}
): Promise<string> {
  const pdfBlob = await generatePDFBlob(elementId, pdfOptions);
  
  // 下载PDF
  const filename = pdfOptions.filename || "guide-application.pdf";
  downloadPDF(pdfBlob, filename);
  
  // 上传PDF
  return await uploadPDF(pdfBlob, uploadOptions);
}
