import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "错误",
        description: "请输入您的邮箱地址",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "错误",
        description: "请输入有效的邮箱地址",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setIsSubmitted(true);
      toast({
        title: "邮件已发送",
        description: "如果该邮箱已注册，您将收到重置密码的邮件",
      });
    } catch (error) {
      toast({
        title: "发送失败",
        description: "发送重置邮件时出现错误，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/login'}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回登录
                </Button>
              </div>
              <div className="mx-auto h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                邮件已发送
              </CardTitle>
              <p className="text-gray-600 mt-2">
                如果该邮箱地址已注册，您将收到重置密码的邮件。请检查您的邮箱（包括垃圾邮件文件夹）。
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  没有收到邮件？请等待几分钟或检查垃圾邮件文件夹。
                </p>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }} 
                    variant="outline" 
                    className="w-full"
                  >
                    重新发送
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => window.location.href = '/login'}
                  >
                    返回登录
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/login'}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回登录
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              忘记密码？
            </CardTitle>
            <p className="text-gray-600 mt-2">
              输入您的邮箱地址，我们将发送重置密码的链接给您。
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱地址
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="输入您的邮箱地址"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "发送中..." : "发送重置链接"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;
