import React, { useState } from "react";
import { PrintAndSave, usePDFGeneration } from "@replit/guide-form";

interface GuideFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  token?: string;
}

export function GuideFormModal({ 
  isOpen, 
  onClose, 
  applicationId = "demo-123",
  token = "demo-token" 
}: GuideFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    motivation: "",
  });

  const { downloadPDF, isProcessing } = usePDFGeneration({
    onSuccess: () => {
      console.log("PDF generated successfully!");
    },
    onError: (error) => {
      console.error("PDF generation failed:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里可以添加表单提交逻辑
    console.log("Form submitted:", formData);
  };

  const handleDownloadPDF = () => {
    downloadPDF("print-root", {
      filename: `guide-application-${applicationId}.pdf`,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">成为向导申请表</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              电话
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              相关经验
            </label>
            <textarea
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              申请动机
            </label>
            <textarea
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              提交申请
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isProcessing}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
            >
              {isProcessing ? "生成中..." : "下载PDF"}
            </button>
            <PrintAndSave
              applicationId={applicationId}
              token={token}
              uploadUrl={`/api/v2/guide-applications/${applicationId}/archive-pdf`}
              className="flex-1"
            />
          </div>
        </form>

        {/* 打印预览区域 */}
        <div id="print-root" className="hidden print:block">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center mb-8">向导申请表</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">基本信息</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>姓名:</strong> {formData.name || "未填写"}
                  </div>
                  <div>
                    <strong>邮箱:</strong> {formData.email || "未填写"}
                  </div>
                  <div>
                    <strong>电话:</strong> {formData.phone || "未填写"}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">相关经验</h2>
                <p className="text-gray-700">{formData.experience || "未填写"}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">申请动机</h2>
                <p className="text-gray-700">{formData.motivation || "未填写"}</p>
              </div>

              <div className="mt-8 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  申请日期: {new Date().toLocaleDateString("zh-CN")}
                </p>
                <p className="text-sm text-gray-500">
                  申请ID: {applicationId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}