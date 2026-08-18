import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { removeStagedQualificationFile, stageQualificationFile } from "@replit/guide-form";
import { useIntl } from "react-intl";

import { authApi } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QualificationFile {
  description?: string;
  proof?: string;
  publicUrl?: string;
  visible?: boolean;
  uploaded?: boolean;
  name?: string;
  type?: string;
  size?: number;
  fileId?: string;
  stagedFileId?: string;
}

interface ApplicationQualificationUploaderProps {
  value?: { certifications?: Record<string, QualificationFile> };
  onChange: (files: { certifications: Record<string, QualificationFile> }) => void;
  maxFiles?: number;
  deferUpload?: boolean;
}

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ApplicationQualificationUploader({
  value = { certifications: {} },
  onChange,
  maxFiles = 5,
  deferUpload = false,
}: ApplicationQualificationUploaderProps) {
  const intl = useIntl();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const currentFiles = value.certifications ?? {};
  const fileCount = Object.keys(currentFiles).length;

  const format = (
    id: string,
    defaultMessage: string,
    values?: Record<string, string | number | boolean | null | undefined>
  ) => intl.formatMessage({ id, defaultMessage }, values);

  const resetSelection = () => {
    setSelectedFile(null);
    setDescription("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.has(file.type)) {
      toast({
        title: format("applicationQualificationUploader.invalidFileTypeTitle", "Invalid file type"),
        description: format(
          "applicationQualificationUploader.invalidFileTypeDesc",
          "Please select an image (JPEG, PNG, GIF, WEBP) or PDF file."
        ),
        variant: "destructive",
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: format("applicationQualificationUploader.fileTooLargeTitle", "File too large"),
        description: format(
          "applicationQualificationUploader.fileTooLargeDesc",
          "Please select a file smaller than 10MB."
        ),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!validateFile(file)) {
      resetSelection();
      return;
    }
    setSelectedFile(file);
  };

  const handleAddFile = async () => {
    if (!selectedFile || !description.trim()) {
      toast({
        title: format("applicationQualificationUploader.missingInfoTitle", "Missing information"),
        description: format(
          "applicationQualificationUploader.missingInfoDesc",
          "Please select a file and provide a description."
        ),
        variant: "destructive",
      });
      return;
    }

    if (fileCount >= maxFiles) {
      toast({
        title: format("applicationQualificationUploader.maxFilesReachedTitle", "Maximum files reached"),
        description: format("applicationQualificationUploader.maxFilesReachedDesc", "You can upload up to {maxFiles} files.", {
          maxFiles,
        }),
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      if (deferUpload) {
        const stagedFile = await stageQualificationFile(selectedFile, description.trim());
        onChange({
          certifications: {
            ...currentFiles,
            [stagedFile.fileId]: {
              stagedFileId: stagedFile.fileId,
              fileId: stagedFile.fileId,
              description: stagedFile.description,
              visible: stagedFile.visible,
              name: stagedFile.name,
              type: stagedFile.type,
              size: stagedFile.size,
              uploaded: false,
            },
          },
        });
        toast({
          title: format("applicationQualificationUploader.stagedTitle", "File saved locally"),
          description: format(
            "applicationQualificationUploader.stagedDesc",
            "This file will upload after account verification."
          ),
          variant: "success",
        });
      } else {
        const body = new FormData();
        body.append("file", selectedFile);
        body.append("description", description.trim());
        const result = await authApi.upload("/api/v2/guide-applications/qualification-upload", body);
        const fileId = String(result.fileId ?? crypto.randomUUID());
        onChange({
          certifications: {
            ...currentFiles,
            [fileId]: {
              proof: result.publicUrl,
              publicUrl: result.publicUrl,
              description: description.trim(),
              visible: true,
              uploaded: true,
            },
          },
        });
      }
      resetSelection();
    } catch (error) {
      console.error("Qualification file handling failed:", error);
      toast({
        title: format("applicationQualificationUploader.errorTitle", "Error"),
        description: format(
          "applicationQualificationUploader.errorDesc",
          "Failed to save this file. Please try again."
        ),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    const file = currentFiles[fileId];
    if (file?.stagedFileId && !file.uploaded) {
      void removeStagedQualificationFile(file.stagedFileId);
    }

    const nextFiles = { ...currentFiles };
    delete nextFiles[fileId];
    onChange({ certifications: nextFiles });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-900">
          {intl.formatMessage({ id: "becomeGuide.step1.qualificationFiles" })}
        </p>
        <p className="text-xs text-gray-500">
          {intl.formatMessage(
            { id: "becomeGuide.step1.uploadedFiles" },
            { current: fileCount, max: maxFiles }
          )}
        </p>
      </div>

      {fileCount > 0 && (
        <div className="space-y-2">
          {Object.entries(currentFiles).map(([fileId, file]) => (
            <div
              key={fileId}
              className="flex items-center justify-between gap-3 rounded border border-gray-200 bg-gray-50 p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {file.description || file.name || fileId}
                </p>
                <p className="text-xs text-gray-500">
                  {file.proof || file.publicUrl
                    ? intl.formatMessage({ id: "becomeGuide.step1.uploaded" })
                    : deferUpload
                      ? intl.formatMessage({
                          id: "becomeGuide.step1.stagedForUpload",
                          defaultMessage: "Saved locally until verification",
                        })
                      : intl.formatMessage({ id: "becomeGuide.step1.uploading" })}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(fileId)}
                className="shrink-0 text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 rounded border border-dashed border-gray-300 p-4">
        <div>
          <Label htmlFor="qualification-file">
            {intl.formatMessage({ id: "becomeGuide.step1.uploadQualificationFiles" })}
          </Label>
          <p className="mt-1 text-xs text-gray-500">
            {intl.formatMessage({ id: "becomeGuide.step1.uploadQualificationFilesDescription" })}
          </p>
          <Input
            ref={inputRef}
            id="qualification-file"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="mt-2"
            disabled={isUploading || fileCount >= maxFiles}
          />
          {selectedFile && (
            <p className="mt-1 text-xs text-gray-500">
              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="qualification-description">
            {intl.formatMessage({ id: "becomeGuide.step1.fileDescription" })} *
          </Label>
          <Textarea
            id="qualification-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={intl.formatMessage({
              id: "becomeGuide.step1.fileDescriptionPlaceholder",
            })}
            rows={3}
            disabled={isUploading || fileCount >= maxFiles}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddFile}
          disabled={!selectedFile || !description.trim() || isUploading || fileCount >= maxFiles}
          className="flex items-center gap-2"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {intl.formatMessage({ id: "becomeGuide.step1.uploadFile" })}
        </Button>
      </div>
    </div>
  );
}
