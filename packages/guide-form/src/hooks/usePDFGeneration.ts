import { useState, useCallback } from "react";
import {
  generatePDFBlob,
  generateAndDownloadPDF,
  generateAndUploadPDF,
  generateDownloadAndUploadPDF,
  PDFOptions,
  PDFUploadOptions,
} from "../utils/pdfGenerator";

export interface UsePDFGenerationOptions {
  onSuccess?: (fileKey?: string) => void;
  onError?: (error: Error) => void;
}

export function usePDFGeneration(options: UsePDFGenerationOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { onSuccess, onError } = options;

  const handleError = useCallback(
    (error: Error) => {
      console.error("PDF generation error:", error);
      onError?.(error);
    },
    [onError]
  );

  const generatePDF = useCallback(
    async (elementId: string, pdfOptions: PDFOptions = {}) => {
      setIsProcessing(true);
      try {
        const pdfBlob = await generatePDFBlob(elementId, pdfOptions);
        onSuccess?.();
        return pdfBlob;
      } catch (error) {
        handleError(error instanceof Error ? error : new Error("Unknown error"));
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [onSuccess, handleError]
  );

  const downloadPDF = useCallback(
    async (elementId: string, pdfOptions: PDFOptions = {}) => {
      setIsProcessing(true);
      try {
        await generateAndDownloadPDF(elementId, pdfOptions);
        onSuccess?.();
      } catch (error) {
        handleError(error instanceof Error ? error : new Error("Unknown error"));
      } finally {
        setIsProcessing(false);
      }
    },
    [onSuccess, handleError]
  );

  const uploadPDF = useCallback(
    async (
      elementId: string,
      uploadOptions: PDFUploadOptions,
      pdfOptions: PDFOptions = {}
    ) => {
      setIsProcessing(true);
      try {
        const fileKey = await generateAndUploadPDF(
          elementId,
          uploadOptions,
          pdfOptions
        );
        onSuccess?.(fileKey);
        return fileKey;
      } catch (error) {
        handleError(error instanceof Error ? error : new Error("Unknown error"));
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [onSuccess, handleError]
  );

  const downloadAndUploadPDF = useCallback(
    async (
      elementId: string,
      uploadOptions: PDFUploadOptions,
      pdfOptions: PDFOptions = {}
    ) => {
      setIsProcessing(true);
      try {
        const fileKey = await generateDownloadAndUploadPDF(
          elementId,
          uploadOptions,
          pdfOptions
        );
        onSuccess?.(fileKey);
        return fileKey;
      } catch (error) {
        handleError(error instanceof Error ? error : new Error("Unknown error"));
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [onSuccess, handleError]
  );

  return {
    isProcessing,
    generatePDF,
    downloadPDF,
    uploadPDF,
    downloadAndUploadPDF,
  };
}
