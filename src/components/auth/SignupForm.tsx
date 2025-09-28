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
import { useIntl } from 'react-intl';
import { useLanguage } from '@/i18n/LanguageProvider';

const createSignupSchema = (intl: any) => z.object({
  username: z.string().min(3, intl.formatMessage({ id: 'signup.validation.usernameMinLength' })),
  email: z.string().email(intl.formatMessage({ id: 'signup.validation.emailInvalid' })),
  password: z.string().min(8, intl.formatMessage({ id: 'signup.validation.passwordMinLength' })),
  confirmPassword: z.string(),
  firstName: z.string().min(1, intl.formatMessage({ id: 'signup.validation.firstNameRequired' })),
  lastName: z.string().min(1, intl.formatMessage({ id: 'signup.validation.lastNameRequired' })),
}).refine((data) => data.password === data.confirmPassword, {
  message: intl.formatMessage({ id: 'signup.validation.passwordMismatch' }),
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<ReturnType<typeof createSignupSchema>>;

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
  const intl = useIntl();
  const { locale } = useLanguage();
  
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
    resolver: zodResolver(createSignupSchema(intl) as any),
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
      setUsernameError(intl.formatMessage({ id: 'signup.usernameValidation.invalidFormat' }));
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
        setUsernameError(intl.formatMessage({ id: 'signup.usernameValidation.usernameTaken' }));
        const suggestion = `${username}${Math.floor(Math.random() * 1000)}`;
        setUsernameSuggestion(suggestion);
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameError(intl.formatMessage({ id: 'signup.usernameValidation.checkError' }));
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
        title: intl.formatMessage({ id: 'signup.error.agreeToTerms' }),
        description: intl.formatMessage({ id: 'signup.error.agreeToTermsDescription' }),
        variant: "destructive"
      });
      return;
    }

    if (usernameError) {
      toast({
        title: intl.formatMessage({ id: 'signup.error.usernameUnavailable' }),
        description: intl.formatMessage({ id: 'signup.error.usernameUnavailableDescription' }),
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
          title: intl.formatMessage({ id: 'signup.success.title' }),
          description: intl.formatMessage({ id: 'signup.success.description' }),
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
        title: intl.formatMessage({ id: 'signup.error.title' }),
        description: intl.formatMessage({ id: 'signup.error.description' }),
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
                {intl.formatMessage({ id: 'signup.backToHome' })}
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {intl.formatMessage({ id: 'signup.title' })}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {intl.formatMessage({ id: 'signup.subtitle' })}
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
                          {intl.formatMessage({ id: 'signup.firstName' })}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={intl.formatMessage({ id: 'signup.firstNamePlaceholder' })}
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
                          {intl.formatMessage({ id: 'signup.lastName' })}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={intl.formatMessage({ id: 'signup.lastNamePlaceholder' })}
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
                        {intl.formatMessage({ id: 'signup.username' })}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            {...field}
                            placeholder={intl.formatMessage({ id: 'signup.usernamePlaceholder' })}
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
                        <p className="text-sm text-gray-500 mt-1">{intl.formatMessage({ id: 'signup.checkingAvailability' })}</p>
                      )}
                      {usernameError && (
                        <p className="text-sm text-red-500 mt-1">{usernameError}</p>
                      )}
                      {usernameSuggestion && (
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">{intl.formatMessage({ id: 'signup.suggestion' })}: </p>
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
                        {intl.formatMessage({ id: 'signup.email' })}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            {...field}
                            type="email"
                            placeholder={intl.formatMessage({ id: 'signup.emailPlaceholder' })}
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
                        {intl.formatMessage({ id: 'signup.password' })}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={intl.formatMessage({ id: 'signup.passwordPlaceholder' })}
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
                            {intl.formatMessage({ id: 'signup.passwordRequirements' })}
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
                        {intl.formatMessage({ id: 'signup.confirmPassword' })}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={intl.formatMessage({ id: 'signup.confirmPasswordPlaceholder' })}
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
                      {intl.formatMessage({ id: 'signup.agreeToTerms' })}{" "}
                      <a href="/terms" className="text-yellow-600 hover:text-yellow-700 underline">
                        {intl.formatMessage({ id: 'signup.termsOfService' })}
                      </a>{" "}
                      {intl.formatMessage({ id: 'signup.and' })}{" "}
                      <a href="/privacy" className="text-yellow-600 hover:text-yellow-700 underline">
                        {intl.formatMessage({ id: 'signup.privacyPolicy' })}
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
                      {intl.formatMessage({ id: 'signup.emailUpdates' })}
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                  disabled={form.formState.isSubmitting || !agreedToTerms}
                >
                  {form.formState.isSubmitting ? intl.formatMessage({ id: 'signup.creating' }) : intl.formatMessage({ id: 'signup.createAccount' })}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {intl.formatMessage({ id: 'signup.alreadyHaveAccount' })}{' '}
                <button
                  onClick={() => window.location.href = '/login'}
                  className="text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  {intl.formatMessage({ id: 'signup.loginNow' })}
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
