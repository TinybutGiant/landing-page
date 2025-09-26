import { useState } from "react";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  description: string;
}

interface SupplementalMaterialsUploadProps {
  applicationId: string;
  onSubmitSuccess?: () => void;
  // UI组件
  Card: any;
  CardContent: any;
  CardHeader: any;
  CardTitle: any;
  Button: any;
  Textarea: any;
  Input: any;
  Label: any;
  // 图标组件
  Upload: any;
  FileText: any;
  X: any;
  CheckCircle: any;
  // 回调函数
  onFileUpload?: (file: File) => Promise<{ fileId: string; publicUrl: string }>;
  onSubmit?: (data: any) => Promise<void>;
  onToast?: (options: { title: string; description?: string; variant?: string }) => void;
}

export function SupplementalMaterialsUpload({ 
  applicationId, 
  onSubmitSuccess,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Textarea,
  Input,
  Label,
  Upload,
  FileText,
  X,
  CheckCircle,
  onFileUpload,
  onSubmit,
  onToast
}: SupplementalMaterialsUploadProps) {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // 文件类型验证
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      onToast?.({
        title: "文件类型不支持",
        description: "请上传图片、PDF或Word文档",
        variant: "destructive"
      });
      return;
    }

    // 文件大小验证 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      onToast?.({
        title: "文件过大",
        description: "文件大小不能超过10MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      if (!onFileUpload) {
        throw new Error('文件上传功能未配置');
      }

      const result = await onFileUpload(selectedFile);
      
      const newFile: UploadedFile = {
        id: result.fileId,
        name: selectedFile.name,
        url: result.publicUrl,
        size: selectedFile.size,
        description: ""
      };

      setFiles(prev => [...prev, newFile]);
      
      onToast?.({
        title: "文件上传成功",
        description: `${selectedFile.name} 已上传`
      });

    } catch (error) {
      console.error("文件上传失败:", error);
      onToast?.({
        title: "上传失败",
        description: error instanceof Error ? error.message : "文件上传失败",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // 重置input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const updateFileDescription = (fileId: string, description: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, description } : f
    ));
  };

  const handleSubmit = async () => {
    if (!description.trim() && files.length === 0) {
      onToast?.({
        title: "请填写内容",
        description: "请至少填写补充说明或上传一个文件",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      // 构建 user_response 数据
      const userResponse: {
        description?: string;
        certifications?: Record<string, { proof: string; description: string; visible?: boolean }>;
      } = {};

      if (description.trim()) {
        userResponse.description = description.trim();
      }

      if (files.length > 0) {
        userResponse.certifications = {};
        files.forEach((file, index) => {
          const key = `supplemental_${Date.now()}_${index}`;
          userResponse.certifications![key] = {
            proof: file.url,
            description: file.description || file.name,
            visible: true
          };
        });
      }

      if (!onSubmit) {
        throw new Error('提交功能未配置');
      }

      await onSubmit({
        applicationId,
        userResponse
      });

      onToast?.({
        title: "提交成功",
        description: "补充材料已提交，申请状态已更新为待审核"
      });

      // 重置表单
      setDescription("");
      setFiles([]);
      
      // 调用成功回调
      onSubmitSuccess?.();

    } catch (error) {
      console.error("提交补充材料失败:", error);
      onToast?.({
        title: "提交失败",
        description: error instanceof Error ? error.message : "提交补充材料失败",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="rounded-2xl shadow-lg border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Upload className="h-5 w-5" />
          补充材料尚未上传
        </CardTitle>
        <p className="text-sm text-orange-600">
          请根据管理员要求上传补充材料以继续审核流程
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 文字说明输入框 */}
        <div className="space-y-2">
          <Label htmlFor="description">补充说明</Label>
          <Textarea
            id="description"
            placeholder="请详细说明您提供的补充材料..."
            value={description}
                      onChange={(e: any) => setDescription(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* 文件上传区域 */}
        <div className="space-y-2">
          <Label>补充文件</Label>
          <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center">
            <Input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="file-upload"
              accept="image/*,.pdf,.doc,.docx"
            />
            <Label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="h-8 w-8 text-orange-500" />
              <span className="text-sm text-orange-600">
                {uploading ? "上传中..." : "点击选择文件"}
              </span>
              <span className="text-xs text-gray-500">
                支持图片、PDF、Word文档，最大10MB
              </span>
            </Label>
          </div>
        </div>

        {/* 已上传文件列表 */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label>已上传文件</Label>
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                    <Input
                      placeholder="文件描述（可选）"
                      value={file.description}
                      onChange={(e: any) => updateFileDescription(file.id, e.target.value)}
                      className="mt-1 text-xs"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 提交按钮 */}
        <div className="pt-4">
          <Button 
            onClick={handleSubmit}
            disabled={submitting || (!description.trim() && files.length === 0)}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {submitting ? (
              "提交中..."
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                提交补充材料
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
