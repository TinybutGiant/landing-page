import React, { useState } from 'react';
import { usePDFGeneration } from '@replit/guide-form';

const PDFTestPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '测试用户',
    email: 'test@example.com',
    phone: '123-456-7890',
    experience: '我有5年的导游经验',
    motivation: '希望帮助更多游客了解当地文化'
  });

  const { downloadPDF, isProcessing } = usePDFGeneration({
    onSuccess: () => {
      console.log("PDF generated successfully!");
    },
    onError: (error: Error) => {
      console.error("PDF generation failed:", error);
    },
  });

  const handleDownloadPDF = () => {
    downloadPDF("print-root", {
      filename: "test-application.pdf",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">PDF功能测试</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">表单数据</h2>
          <div className="space-y-2">
            <div><strong>姓名:</strong> {formData.name}</div>
            <div><strong>邮箱:</strong> {formData.email}</div>
            <div><strong>电话:</strong> {formData.phone}</div>
            <div><strong>经验:</strong> {formData.experience}</div>
            <div><strong>动机:</strong> {formData.motivation}</div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleDownloadPDF}
            disabled={isProcessing}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:bg-gray-400"
          >
            {isProcessing ? "生成中..." : "下载PDF"}
          </button>
        </div>

        {/* 打印预览内容 */}
        <div id="print-root" className="hidden print:block">
          <div className="p-8 bg-white">
            <h1 className="text-3xl font-bold text-center mb-8">向导申请表</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">基本信息</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>姓名:</strong> {formData.name}</div>
                  <div><strong>邮箱:</strong> {formData.email}</div>
                  <div><strong>电话:</strong> {formData.phone}</div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">相关经验</h2>
                <p className="text-gray-700">{formData.experience}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">申请动机</h2>
                <p className="text-gray-700">{formData.motivation}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  申请日期: {new Date().toLocaleDateString("zh-CN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTestPage;
