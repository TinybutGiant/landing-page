import { Route, Router } from "wouter";
import LandingPage from "@/pages/LandingPage";
import BecomeGuidePage from "@/pages/BecomeGuidePage";
import SignupPage from "@/pages/SignupPage";
import LoginPage from "@/pages/LoginPage";
import PDFTestPage from "@/pages/PDFTestPage";
import { AuthProvider } from "@/context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Route path="/" component={LandingPage} />
        <Route path="/become-guide" component={BecomeGuidePage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/pdf-test" component={PDFTestPage} />
      </Router>
    </AuthProvider>
  );
};

export default App;