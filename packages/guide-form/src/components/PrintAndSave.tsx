import React, { useState } from "react";
import { generateDownloadAndUploadPDF, PDFOptions, PDFUploadOptions } from "../utils/pdfGenerator";

export interface PrintAndSaveProps {
  applicationId: string;
  token: string;
  uploadUrl: string;
  elementId?: string;
  pdfOptions?: PDFOptions;
  onSuccess?: (fileKey: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function PrintAndSave({
  applicationId,
  token,
  uploadUrl,
  elementId = "print-root",
  pdfOptions = {},
  onSuccess,
  onError,
  className = "",
  children,
  disabled = false,
}: PrintAndSaveProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePrintAndSave = async () => {
    if (isProcessing || disabled) return;

    if (!token) {
      const error = new Error("Authentication token is required");
      onError?.(error);
      return;
    }

    if (!applicationId) {
      const error = new Error("Application ID is required");
      onError?.(error);
      return;
    }

    setIsProcessing(true);

    try {
      const uploadOptions: PDFUploadOptions = {
        applicationId,
        token,
        uploadUrl,
      };

      const mergedPdfOptions: PDFOptions = {
        filename: `guide-application-${applicationId}.pdf`,
        ...pdfOptions,
      };

      console.log("🔄 开始一键打印保存...", {
        applicationId,
        elementId,
        uploadUrl,
      });

      const fileKey = await generateDownloadAndUploadPDF(
        elementId,
        uploadOptions,
        mergedPdfOptions
      );

      console.log("✅ 一键打印保存成功:", fileKey);

      onSuccess?.(fileKey);

      // 打开打印对话框
      setTimeout(() => {
        window.print();
      }, 1000);
    } catch (error) {
      console.error("❌ 一键打印保存失败:", error);
      onError?.(error instanceof Error ? error : new Error("Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePrintAndSave}
      disabled={isProcessing || disabled}
      className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-colors ${
        isProcessing || disabled
          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
          : "bg-yellow-500 hover:bg-yellow-600 text-black"
      } ${className}`}
    >
      {isProcessing ? (
        <>
          <div className="w-4 h-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
          处理中...
        </>
      ) : (
        children || (
          <>
            <div className="flex items-center space-x-1 mr-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
            </div>
            一键打印保存
          </>
        )
      )}
    </button>
  );
}
