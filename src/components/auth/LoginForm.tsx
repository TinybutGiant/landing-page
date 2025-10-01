import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, User, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIntl } from 'react-intl';
import { useLanguage } from '@/i18n/LanguageProvider';

const createLoginSchema = (intl: any) => z.object({
  username: z.string().min(1, intl.formatMessage({ id: 'login.validation.usernameRequired' })),
  password: z.string().min(1, intl.formatMessage({ id: 'login.validation.passwordRequired' })),
});

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, redirectTo }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const { toast } = useToast();
  const intl = useIntl();
  const { locale } = useLanguage();
  const [, setLocation] = useLocation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(intl) as any),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // 如果用户已登录，自动重定向
  useEffect(() => {
    if (user) {
      if (onSuccess) {
        onSuccess();
      } else if (redirectTo) {
        window.location.href = redirectTo;
      } else {
        window.location.href = '/become-guide';
      }
    }
  }, [user, onSuccess, redirectTo]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('LoginForm: 开始登录流程');
      
      // 登录前检查localStorage状态
      const beforeLoginData: { [key: string]: any } = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            beforeLoginData[key] = JSON.parse(localStorage.getItem(key) || '');
          } catch {
            beforeLoginData[key] = localStorage.getItem(key);
          }
        }
      }
      console.log('LoginForm: 登录前localStorage状态:', beforeLoginData);
      
      const success = await login(data.username, data.password);
      if (success) {
        console.log('LoginForm: 登录成功');
        toast({
          title: intl.formatMessage({ id: 'login.success.title' }),
          description: intl.formatMessage({ id: 'login.success.description' }),
          variant: "success"
        });
        
        // 登录后检查localStorage状态
        const afterLoginData: { [key: string]: any } = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            try {
              afterLoginData[key] = JSON.parse(localStorage.getItem(key) || '');
            } catch {
              afterLoginData[key] = localStorage.getItem(key);
            }
          }
        }
        console.log('LoginForm: 登录后localStorage状态:', afterLoginData);
        
        if (onSuccess) {
          onSuccess();
        } else if (redirectTo) {
          setLocation(redirectTo);
        } else {
          // 默认跳转到申请页面
          setLocation('/become-guide');
        }
      } else {
        toast({
          title: intl.formatMessage({ id: 'login.error.title' }),
          description: intl.formatMessage({ id: 'login.error.invalidCredentials' }),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: intl.formatMessage({ id: 'login.error.title' }),
        description: intl.formatMessage({ id: 'login.error.networkError' }),
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
                {intl.formatMessage({ id: 'login.backToHome' })}
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {intl.formatMessage({ id: 'login.title' })}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {intl.formatMessage({ id: 'login.subtitle' })}
            </p>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        {intl.formatMessage({ id: 'login.username' })}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            {...field}
                            placeholder={intl.formatMessage({ id: 'login.usernamePlaceholder' })}
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
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          {intl.formatMessage({ id: 'login.password' })}
                        </FormLabel>
                        <button
                          type="button"
                          onClick={() => window.location.href = '/forgot-password'}
                          className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                        >
                          {intl.formatMessage({ id: 'login.forgotPassword' })}
                        </button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={intl.formatMessage({ id: 'login.passwordPlaceholder' })}
                            className="pl-10 pr-10"
                            disabled={form.formState.isSubmitting}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? intl.formatMessage({ id: 'login.loggingIn' }) : intl.formatMessage({ id: 'login.loginButton' })}
                </Button>
              </form>
            </Form>

            {/* Only show signup link if redirect is specifically to become-guide */}
            {redirectTo === '/become-guide' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {intl.formatMessage({ id: 'login.noAccount' })}{' '}
                  <button
                    onClick={() => window.location.href = '/signup'}
                    className="text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    {intl.formatMessage({ id: 'login.signupNow' })}
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginForm;
