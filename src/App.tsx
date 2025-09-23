import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Star, 
  MapPin, 
  Heart,
  Globe,
  Shield
} from "lucide-react";
import CursorFollow from "@/components/CursorFollow";
import GuideFormModal from "@/components/become-guide/GuideFormModal";

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

  const [showBecomeGuideForm, setShowBecomeGuideForm] = useState(false);


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
          </motion.div>
        </div>
      </motion.div>

      {/* Become Guide Form Modal */}
      {showBecomeGuideForm && (
        <GuideFormModal onClose={() => setShowBecomeGuideForm(false)} />
      )}
    </div>
  );
};

export default LandingPage;
