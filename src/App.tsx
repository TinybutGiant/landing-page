import { Route, Router } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "@/pages/LandingPage";
import BecomeGuidePage from "@/pages/BecomeGuidePage";
import SignupPage from "@/pages/SignupPage";
import LoginPage from "@/pages/LoginPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import PDFTestPage from "@/pages/PDFTestPage";
import ViewApplicationStatusPage from "@/pages/ViewApplicationStatusPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { Toaster } from "@/components/ui/toaster";

// 创建QueryClient实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Route path="/" component={LandingPage} />
            <Route path="/become-guide" component={BecomeGuidePage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <Route path="/reset-password" component={ResetPasswordPage} />
            <Route path="/pdf-test" component={PDFTestPage} />
            <Route path="/view-application-status" component={ViewApplicationStatusPage} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/privacy" component={PrivacyPage} />
          </Router>
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;