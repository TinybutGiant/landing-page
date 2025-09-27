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
import { AuthProvider } from "@/context/AuthContext";
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
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;