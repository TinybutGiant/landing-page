import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIntl } from 'react-intl';
import { useLanguage } from '@/i18n/LanguageProvider';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const intl = useIntl();
  const { locale } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: intl.formatMessage({ id: 'forgotPassword.error.title' }),
        description: intl.formatMessage({ id: 'forgotPassword.error.emailRequired' }),
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: intl.formatMessage({ id: 'forgotPassword.error.title' }),
        description: intl.formatMessage({ id: 'forgotPassword.error.invalidEmail' }),
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
        title: intl.formatMessage({ id: 'forgotPassword.success.title' }),
        description: intl.formatMessage({ id: 'forgotPassword.success.description' }),
      });
    } catch (error) {
      toast({
        title: intl.formatMessage({ id: 'forgotPassword.error.sendFailed' }),
        description: intl.formatMessage({ id: 'forgotPassword.error.sendFailedDescription' }),
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
                  {intl.formatMessage({ id: 'forgotPassword.backToLogin' })}
                </Button>
              </div>
              <div className="mx-auto h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {intl.formatMessage({ id: 'forgotPassword.emailSent.title' })}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {intl.formatMessage({ id: 'forgotPassword.emailSent.description' })}
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  {intl.formatMessage({ id: 'forgotPassword.emailSent.noEmailReceived' })}
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
                    {intl.formatMessage({ id: 'forgotPassword.resendEmail' })}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => window.location.href = '/login'}
                  >
                    {intl.formatMessage({ id: 'forgotPassword.backToLogin' })}
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
                {intl.formatMessage({ id: 'forgotPassword.backToLogin' })}
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {intl.formatMessage({ id: 'forgotPassword.title' })}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {intl.formatMessage({ id: 'forgotPassword.subtitle' })}
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {intl.formatMessage({ id: 'forgotPassword.emailLabel' })}
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
                    placeholder={intl.formatMessage({ id: 'forgotPassword.emailPlaceholder' })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? intl.formatMessage({ id: 'forgotPassword.sending' }) : intl.formatMessage({ id: 'forgotPassword.sendResetLink' })}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;
