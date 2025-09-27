import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { checkUsernameAvailability, validateUsername, calculatePasswordStrength } from "@/lib/auth";

const signupSchema = z.object({
  username: z.string().min(3, '用户名至少需要3个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少需要8个字符'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, '请输入名字'),
  lastName: z.string().min(1, '请输入姓氏'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, redirectTo }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const { toast } = useToast();
  
  // Username validation state
  const [usernameError, setUsernameError] = useState<string>("");
  const [usernameSuggestion, setUsernameSuggestion] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
    color: string;
  }>({ score: 0, label: "", color: "" });

  const { signUp } = useAuth();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema as any),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    }
  });

  // Username validation function
  const handleUsernameChange = async (username: string) => {
    if (!validateUsername(username)) {
      setUsernameError("用户名必须至少3个字符，只能包含小写字母和数字");
      setUsernameSuggestion("");
      return;
    }

    setIsCheckingUsername(true);
    try {
      const result = await checkUsernameAvailability(username);
      
      if (result.available) {
        setUsernameError("");
        setUsernameSuggestion("");
      } else {
        setUsernameError("用户名已被占用");
        const suggestion = `${username}${Math.floor(Math.random() * 1000)}`;
        setUsernameSuggestion(suggestion);
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameError("检查用户名可用性时出错");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Password strength calculation
  const handlePasswordChange = (password: string) => {
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  };

  const onSubmit = async (data: SignupFormData) => {
    if (!agreedToTerms) {
      toast({
        title: "请同意服务条款",
        description: "请同意服务条款和隐私声明",
        variant: "destructive"
      });
      return;
    }

    if (usernameError) {
      toast({
        title: "用户名不可用",
        description: "请选择一个可用的用户名",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('SignupForm: 开始注册流程');
      
      // 注册前检查localStorage状态
      const beforeSignupData: { [key: string]: any } = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            beforeSignupData[key] = JSON.parse(localStorage.getItem(key) || '');
          } catch {
            beforeSignupData[key] = localStorage.getItem(key);
          }
        }
      }
      console.log('SignupForm: 注册前localStorage状态:', beforeSignupData);
      
      // Combine firstName and lastName into fullName
      const { firstName, lastName, ...restData } = data;
      const signupData = {
        ...restData,
        fullName: `${firstName} ${lastName}`,
        emailUpdates: emailUpdates,
      };

      const success = await signUp(signupData);
      if (success) {
        console.log('SignupForm: 注册成功，用户已自动登录');
        toast({
          title: "注册成功",
          description: "欢迎加入我们！",
          variant: "success"
        });
        
        // 注册后检查localStorage状态
        const afterSignupData: { [key: string]: any } = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            try {
              afterSignupData[key] = JSON.parse(localStorage.getItem(key) || '');
            } catch {
              afterSignupData[key] = localStorage.getItem(key);
            }
          }
        }
        console.log('SignupForm: 注册后localStorage状态:', afterSignupData);
        
        if (onSuccess) {
          onSuccess();
        } else if (redirectTo) {
          window.location.href = redirectTo;
        } else {
          // 默认跳转到申请页面
          window.location.href = '/become-guide';
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "注册失败",
        description: "请重试",
        variant: "destructive"
      });
    }
  };

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
                onClick={() => window.location.href = '/'}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              注册账号
            </CardTitle>
            <p className="text-gray-600 mt-2">
              创建您的YaoTu账号，开始您的导游之旅
            </p>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          名字
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="名字"
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          姓氏
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="姓氏"
                            disabled={form.formState.isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        用户名
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            {...field}
                            placeholder="选择用户名（小写字母和数字）"
                            className="pl-10"
                            disabled={form.formState.isSubmitting}
                            onChange={(e) => {
                              field.onChange(e);
                              const value = e.target.value.toLowerCase();
                              if (value.length >= 3) {
                                handleUsernameChange(value);
                              } else {
                                setUsernameError("");
                                setUsernameSuggestion("");
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      {isCheckingUsername && (
                        <p className="text-sm text-gray-500 mt-1">检查可用性...</p>
                      )}
                      {usernameError && (
                        <p className="text-sm text-red-500 mt-1">{usernameError}</p>
                      )}
                      {usernameSuggestion && (
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">建议: </p>
                          <button
                            type="button"
                            onClick={() => {
                              form.setValue("username", usernameSuggestion);
                              setUsernameError("");
                              setUsernameSuggestion("");
                            }}
                            className="text-sm text-blue-500 hover:text-blue-700 underline"
                          >
                            {usernameSuggestion}
                          </button>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        邮箱地址
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="请输入邮箱地址"
                            className="pl-10"
                            disabled={form.formState.isSubmitting}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        密码
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="创建密码（至少8个字符）"
                            className="pl-10 pr-10"
                            disabled={form.formState.isSubmitting}
                            onChange={(e) => {
                              field.onChange(e);
                              handlePasswordChange(e.target.value);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      {field.value && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  passwordStrength.score <= 2
                                    ? 'bg-red-500'
                                    : passwordStrength.score <= 3
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${passwordStrength.color}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            密码必须包含：字母、数字和特殊字符
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        确认密码
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="请再次输入密码"
                            className="pl-10 pr-10"
                            disabled={form.formState.isSubmitting}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      我同意{" "}
                      <a href="/terms" className="text-yellow-600 hover:text-yellow-700 underline">
                        服务条款
                      </a>{" "}
                      和{" "}
                      <a href="/privacy" className="text-yellow-600 hover:text-yellow-700 underline">
                        隐私声明
                      </a>
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="emailUpdates"
                      checked={emailUpdates}
                      onCheckedChange={(checked) => setEmailUpdates(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="emailUpdates" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      通过邮件接收更新。随时可以取消订阅。
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                  disabled={form.formState.isSubmitting || !agreedToTerms}
                >
                  {form.formState.isSubmitting ? '注册中...' : '创建账号'}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                已有账号？{' '}
                <button
                  onClick={() => window.location.href = '/login'}
                  className="text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  立即登录
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupForm;
