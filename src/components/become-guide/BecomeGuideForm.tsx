import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, 
  CheckCircle
} from "lucide-react";

interface BecomeGuideFormProps {
  onClose: () => void;
}

const BecomeGuideForm = ({ onClose }: BecomeGuideFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    city: "",
    bio: "",
    experience: "",
    languages: "",
    availability: "",
    motivation: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("申请提交成功！我们将在1-3个工作日内联系您。");
      onClose();
    } catch (error) {
      alert("提交失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">成为LocalGuide地陪</h2>
              <p className="text-yellow-100">分享您的当地专业知识，通过引导旅行者了解您的城市来赚钱</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= currentStep
                        ? "bg-white text-yellow-500"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-8 h-1 mx-2 ${
                        step < currentStep ? "bg-white" : "bg-white/20"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">基本信息</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="请输入您的姓名"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      年龄 *
                    </label>
                    <Input
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="请输入您的年龄"
                      min="18"
                      max="120"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱 *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="请输入您的邮箱"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系电话 *
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="请输入您的联系电话"
                    required
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">服务信息</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    服务城市 *
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="请输入您提供服务的城市"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    个人简介 *
                  </label>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="请简单介绍一下您自己，包括您的背景、兴趣爱好等"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    相关经验 *
                  </label>
                  <Textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="请描述您的地陪或旅游相关经验"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    语言能力 *
                  </label>
                  <Input
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    placeholder="例如：中文、英文、日文"
                    required
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">服务偏好</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    可服务时间 *
                  </label>
                  <Textarea
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    placeholder="请描述您的可服务时间，例如：周末全天，工作日晚上"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    申请动机 *
                  </label>
                  <Textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    placeholder="请告诉我们您为什么想成为LocalGuide地陪"
                    rows={3}
                    required
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">申请须知</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        提交申请后，我们将在1-3个工作日内审核您的申请。审核通过后，您将收到邮件通知并可以开始接受预订。
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6"
              >
                上一步
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="px-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                >
                  下一步
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      提交申请
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BecomeGuideForm;
