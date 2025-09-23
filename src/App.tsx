import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowRight, 
  Star, 
  Users, 
  MapPin, 
  Heart,
  Globe,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import CursorFollow from "@/components/CursorFollow";
import BecomeGuideForm from "@/components/become-guide/BecomeGuideForm";

const LandingPage = () => {
  // Refs for scroll-based animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Scroll-based animations for hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  
  // Spring animations for smooth effects
  const springY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBecomeGuideForm, setShowBecomeGuideForm] = useState(false);
  
  // const [location, setLocation] = useLocation();
  
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

  // Username validation function
  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-z0-9]+$/;
    return usernameRegex.test(username) && username.length >= 3;
  };

  // Generate username suggestion
  const generateUsernameSuggestion = (baseUsername: string): string => {
    const randomNum = Math.floor(Math.random() * 1000);
    return `${baseUsername}${randomNum}`;
  };

  // Check username availability (simplified for demo)
  const checkUsernameAvailability = async (username: string) => {
    if (!validateUsername(username)) {
      setUsernameError("Username must be at least 3 characters, lowercase letters and numbers only");
      setUsernameSuggestion("");
      return;
    }

    setIsCheckingUsername(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, assume username is available if it's not "admin" or "test"
      if (username === "admin" || username === "test") {
        setUsernameError("Username already taken");
        const suggestion = generateUsernameSuggestion(username);
        setUsernameSuggestion(suggestion);
      } else {
        setUsernameError("");
        setUsernameSuggestion("");
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameError("Error checking username availability");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let label = "";
    let color = "";

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) {
      label = "Weak";
      color = "text-red-500";
    } else if (score <= 3) {
      label = "Medium";
      color = "text-yellow-500";
    } else {
      label = "Strong";
      color = "text-green-500";
    }

    setPasswordStrength({ score, label, color });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "username") {
      const lowercaseValue = value.toLowerCase();
      setFormData({
        ...formData,
        [name]: lowercaseValue,
      });
      
      if (lowercaseValue.length >= 3) {
        const timeoutId = setTimeout(() => {
          checkUsernameAvailability(lowercaseValue);
        }, 500);
        return () => clearTimeout(timeoutId);
      } else {
        setUsernameError("");
        setUsernameSuggestion("");
      }
    } else if (name === "password") {
      setFormData({
        ...formData,
        [name]: value,
      });
      calculatePasswordStrength(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName) {
      alert("Please fill in your name");
      setIsSubmitting(false);
      return;
    }

    if (!validateUsername(formData.username)) {
      alert("Username format is incorrect");
      setIsSubmitting(false);
      return;
    }

    if (usernameError) {
      alert("Please choose an available username");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters");
      setIsSubmitting(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (!agreedToTerms) {
      alert("Please agree to the Terms of Service and Privacy Statement");
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Account created successfully! Welcome to Ahhh Yaotu!");
      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });
      setCurrentStep(0);
    } catch (error) {
      alert("Error creating account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Local Expertise",
      description: "Connect with knowledgeable locals who know the hidden gems"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-language Support",
      description: "Find guides who speak your language fluently"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safe & Secure",
      description: "Verified guides with secure payment processing"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Personalized Experiences",
      description: "Customized tours tailored to your interests"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      location: "Tokyo",
      rating: 5,
      text: "Amazing experience! My guide showed me places I never would have found on my own."
    },
    {
      name: "Michael Rodriguez",
      location: "Osaka",
      rating: 5,
      text: "Perfect for solo travelers. Felt safe and had an incredible time exploring."
    },
    {
      name: "Emma Thompson",
      location: "Kyoto",
      rating: 5,
      text: "The cultural insights were invaluable. Highly recommend this platform!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        id="hero-section"
        className="relative overflow-hidden min-h-screen flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ y: springY, opacity: springOpacity }}
      >
        {/* 背景动态圆形元素 */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            style={{
              backgroundColor: "#FFD511",
              y: useTransform(scrollYProgress, [0, 1], ["0%", "-100%"])
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            style={{
              backgroundColor: "#FFA500",
              y: useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
            }}
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-40 left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            style={{
              backgroundColor: "#FF8C00",
              y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* 标题（背景层内） */}
        <div className="relative w-full h-full flex flex-col items-center justify-center pt-[20vh] pb-16 px-8">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-bold text-gray-900 dark:text-white cursor-default"
            style={{
              fontFamily:
                '"Satoshi", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: "clamp(48px, 10vw, 180px)",
              lineHeight: "0.9",
              fontWeight: "700",
              letterSpacing: "-0.01em"
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{
                color: "#FFD511",
                transition: { duration: 0.3 }
              }}
            >
              Ahhh Yaotu
            </motion.span>
          </motion.h1>
        </div>

        {/* 顶层：Cursor Follow 效果 */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <CursorFollow 
            containerSelector="#hero-section" 
            cycleMode="sequential"
            showDebugInfo={true}
          />
        </div>
      </motion.div>
  

      {/* Sign Up Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Become a LocalGuide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Share your local expertise and earn money by guiding travelers through your city
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'linear-gradient(to right, #FFD511, #FFA500)' }}
                  >
                    <Users className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Become a LocalGuide
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Share your local expertise and earn money by guiding travelers through your city
                  </p>
                  <Button
                    size="lg"
                    className="w-full rounded-full font-semibold text-white"
                    style={{ 
                      background: 'linear-gradient(to right, #FFD511, #FFA500)',
                      color: '#1A1A1A'
                    }}
                    onClick={() => setShowBecomeGuideForm(true)}
                    data-cursor-hover
                  >
                    Apply to Become a Guide
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Create Your Account
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Join the community of local guides and travelers
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2"
                          style={{ 
                            '--tw-ring-color': '#FFD511',
                            '--tw-border-opacity': '1',
                            'border-color': 'rgba(255, 213, 17, 0.5)'
                          } as React.CSSProperties}
                          placeholder="First name"
                          required
                        />
                      </motion.div>
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2"
                          style={{ 
                            '--tw-ring-color': '#FFD511',
                            '--tw-border-opacity': '1',
                            'border-color': 'rgba(255, 213, 17, 0.5)'
                          } as React.CSSProperties}
                          placeholder="Last name"
                          required
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Username
                      </label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className={`rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 ${usernameError ? 'border-red-500' : ''}`}
                        style={{ 
                          '--tw-ring-color': '#FFD511',
                          '--tw-border-opacity': '1',
                          'border-color': usernameError ? 'rgb(239, 68, 68)' : 'rgba(255, 213, 17, 0.5)'
                        } as React.CSSProperties}
                        placeholder="Choose a username"
                        required
                      />
                      {isCheckingUsername && (
                        <p className="text-sm text-gray-500 mt-1">Checking availability...</p>
                      )}
                      {usernameError && (
                        <p className="text-sm text-red-500 mt-1">{usernameError}</p>
                      )}
                      {usernameSuggestion && (
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">Suggested: </p>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, username: usernameSuggestion });
                              setUsernameError("");
                              setUsernameSuggestion("");
                            }}
                            className="text-sm text-blue-500 hover:text-blue-700 underline"
                          >
                            {usernameSuggestion}
                          </button>
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2"
                        style={{ 
                          '--tw-ring-color': '#FFD511',
                          '--tw-border-opacity': '1',
                          'border-color': 'rgba(255, 213, 17, 0.5)'
                        } as React.CSSProperties}
                        placeholder="Enter your email"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 pr-10"
                          style={{ 
                            '--tw-ring-color': '#FFD511',
                            '--tw-border-opacity': '1',
                            'border-color': 'rgba(255, 213, 17, 0.5)'
                          } as React.CSSProperties}
                          placeholder="Create a password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <motion.div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  passwordStrength.score <= 2
                                    ? 'bg-red-500'
                                    : passwordStrength.score <= 3
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${passwordStrength.color}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 pr-10"
                          style={{ 
                            '--tw-ring-color': '#FFD511',
                            '--tw-border-opacity': '1',
                            'border-color': 'rgba(255, 213, 17, 0.5)'
                          } as React.CSSProperties}
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="space-y-4"
                    >
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={agreedToTerms}
                          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                          className="mt-1"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          I agree to the{" "}
                          <Link href="/terms" className="underline" style={{ color: '#FFD511' }}>
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="underline" style={{ color: '#FFD511' }}>
                            Privacy Statement
                          </Link>
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
                          Send me updates via email. Unsubscribe any time.
                        </label>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full rounded-full font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{ 
                          background: 'linear-gradient(to right, #FFD511, #FFA500)',
                          color: '#1A1A1A'
                        }}
                        disabled={isSubmitting}
                        data-cursor-hover
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                      className="text-center"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link 
                          href="/login" 
                          className="font-semibold"
                          style={{ color: '#FFD511' }}
                        >
                          Sign in
                        </Link>
                      </p>
                    </motion.div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        ref={featuresRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose LocalGuide?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience Japan through the eyes of locals who are passionate about sharing their culture and knowledge.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group relative"
                whileHover={{ y: -10 }}
                data-cursor-hover
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: [0, -5, 5, 0],
                      boxShadow: "0 20px 40px rgba(255, 213, 17, 0.3)"
                    }}
                    transition={{ duration: 0.4 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                    style={{ background: 'linear-gradient(to right, #FFD511, #FFA500)' }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </motion.div>
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold text-gray-900 dark:text-white mb-3"
                  whileHover={{ color: '#FFD511' }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 dark:text-gray-300"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.description}
                </motion.p>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        ref={testimonialsRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of satisfied travelers who have discovered Japan with us.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden group cursor-pointer"
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
                }}
                data-cursor-hover
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-gray-700/50 dark:to-gray-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                />
                <div className="relative z-10">
                  <motion.div 
                    className="flex items-center mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        whileHover={{ 
                          scale: 1.2,
                          rotate: [0, -10, 10, 0],
                          transition: { duration: 0.3 }
                        }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.p 
                    className="text-gray-600 dark:text-gray-300 mb-4 italic"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    "{testimonial.text}"
                  </motion.p>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.location}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        ref={ctaRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(to right, #FFD511, #FFA500)' }}
      >
        {/* Background Parallax Elements */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
          }}
        >
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-xl" />
        </motion.div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 30px rgba(255, 255, 255, 0.5)",
              transition: { duration: 0.3 }
            }}
          >
            Ready to Become a Guide?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl mb-8"
            style={{ color: '#1A1A1A' }}
            whileHover={{ scale: 1.02 }}
          >
            Share your local expertise and earn money by guiding travelers through your city.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                className="bg-white hover:bg-gray-100 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                style={{ color: '#FFD511' }}
                onClick={() => setShowBecomeGuideForm(true)}
                data-cursor-hover
              >
                <motion.span
                  className="relative z-10 flex items-center"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  Apply to Become a Guide
                  <motion.div
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.div>
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white px-8 py-3 rounded-full font-semibold transition-all duration-300 relative overflow-hidden group"
                asChild
                data-cursor-hover
              >
                <Link href="/login">
                  <motion.span
                    className="relative z-10"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    Sign In
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Become Guide Form Modal */}
      {showBecomeGuideForm && (
        <BecomeGuideForm onClose={() => setShowBecomeGuideForm(false)} />
      )}
    </div>
  );
};

export default LandingPage;
