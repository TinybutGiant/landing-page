import { useRef, useState, FormEvent, useEffect, type ReactNode } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MapPin,
  Heart,
  Globe,
  Shield,
  ChevronDown,
  X,
} from "lucide-react";
import CursorFollow from "@/components/CursorFollow";
import BlendCursor from "@/components/BlendCursor";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const DISPLAY_FONT =
  '"Open Runde", "Helvetica Neue", Helvetica, Arial, sans-serif';

type StepItem = { step: string; title: string; image: string };

const StepFlow = ({ steps }: { steps: StepItem[] }) => (
  <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 sm:gap-5">
    {steps.map((item, index) => (
      <div
        key={`${item.step}-${item.title}`}
        className="flex w-full flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.06 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <div className="mb-2 flex h-7 items-center justify-center text-center">
            <span className="text-base font-semibold text-gray-900 sm:text-lg">
              {item.step} {item.title}
            </span>
          </div>
          <motion.div
            className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-md"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </motion.div>
        {index < steps.length - 1 && <div className="h-6" aria-hidden />}
      </div>
    ))}
  </div>
);

const LandingPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated } = useAuth();
  const { messages } = useLanguage();
  const t = (key: string, fallback: string) => messages[key] || fallback;

  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      document.documentElement.classList.add("is-scrolling");
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
      document.documentElement.classList.remove("is-scrolling");
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const orbsY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const { scrollYProgress: ctaScrollProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"],
  });
  const ctaParallaxY = useTransform(ctaScrollProgress, [0, 1], ["12%", "-18%"]);

  const features: {
    icon: ReactNode;
    title: string;
    description: string;
  }[] = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: t("landing.features.safeSecure", "Safe & Secure"),
      description: t(
        "landing.features.safeSecureDesc",
        "Every local is verified, with safety features built into every booking."
      ),
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: t("landing.features.flexibleBooking", "Flexible Booking"),
      description: t(
        "landing.features.flexibleBookingDesc",
        "Skip the back-and-forth and book with confidence."
      ),
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t("landing.features.authenticExperiences", "Authentic Experiences"),
      description: t(
        "landing.features.authenticExperiencesDesc",
        "Experience the city beyond the guidebooks."
      ),
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t("landing.features.expertGuides", "Expert Guides"),
      description: t(
        "landing.features.expertGuidesDesc",
        "Verified locals with deep knowledge of the city."
      ),
    },
  ];

  const travelerSteps: StepItem[] = [
    {
      step: "①",
      title: t("landing.howTraveler.step1", "Find a Local"),
      image: "/3.jpg",
    },
    {
      step: "②",
      title: t("landing.howTraveler.step2", "Book Instantly"),
      image: "/5.jpg",
    },
    {
      step: "③",
      title: t("landing.howTraveler.step3", "Explore Together"),
      image: "/6.jpg",
    },
  ];

  const guideSteps: StepItem[] = [
    {
      step: "①",
      title: t("landing.howGuide.step1", "Open a Slot"),
      image: "/3.jpg",
    },
    {
      step: "②",
      title: t("landing.howGuide.step2", "Book Instantly"),
      image: "/5.jpg",
    },
    {
      step: "③",
      title: t("landing.howGuide.step3", "Explore Together"),
      image: "/6.jpg",
    },
  ];

  const team = [
    {
      name: t("landing.team.designName", "Design Team"),
      text: t(
        "landing.team.design",
        "Good design should feel invisible. We simplify every interaction so you can focus on exploring, not figuring out how the app works."
      ),
    },
    {
      name: t("landing.team.engineeringName", "Engineering Team"),
      text: t(
        "landing.team.engineering",
        "We build a platform that's fast, reliable, and secure—so you can travel with confidence."
      ),
    },
    {
      name: t("landing.team.researchName", "Research Team"),
      text: t(
        "landing.team.research",
        "We listen first. Every feature is shaped by real traveler and local guide insights."
      ),
    },
  ];

  const faqs = [
    {
      q: t("landing.faq.q1", "What is Ahhh Yaotu?"),
      a: t(
        "landing.faq.a1",
        "Ahhh Yaotu connects travelers with verified local guides for authentic, flexible experiences that match your interests and schedule."
      ),
    },
    {
      q: t("landing.faq.q2", "How are local guides verified?"),
      a: t(
        "landing.faq.a2",
        "Every local goes through a verification process so that safety and trust are built into every booking."
      ),
    },
    {
      q: t("landing.faq.q3", "How do I join the waitlist?"),
      a: t(
        "landing.faq.a3",
        "Click “Join the Waitlist to Explore Guides”, leave your name and email, and we’ll notify you when guides are ready to book."
      ),
    },
    {
      q: t("landing.faq.q4", "How can I become a local guide?"),
      a: t(
        "landing.faq.a4",
        "Tap “Become a Local Guide” and apply at the bottom of this page. Share your expertise and open slots for travelers."
      ),
    },
  ];

  const scrollToCta = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleViewApplicationStatus = () => {
    window.location.href = isAuthenticated
      ? "/view-application-status"
      : "/login?redirect=/view-application-status";
  };

  const handleBecomeGuide = () => {
    if (isAuthenticated && localStorage.getItem("yaotu_application_id")) {
      window.location.href = "/view-application-status";
      return;
    }
    window.location.href = "/become-guide";
  };

  const handleWaitlistSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!waitlistName.trim() || !waitlistEmail.trim()) return;
    try {
      const existing = JSON.parse(
        localStorage.getItem("yaotu_waitlist") || "[]"
      ) as Array<{ name: string; email: string; at: string }>;
      existing.push({
        name: waitlistName.trim(),
        email: waitlistEmail.trim(),
        at: new Date().toISOString(),
      });
      localStorage.setItem("yaotu_waitlist", JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }
    setWaitlistSubmitted(true);
  };

  const closeWaitlist = () => {
    setWaitlistOpen(false);
    setWaitlistSubmitted(false);
    setWaitlistName("");
    setWaitlistEmail("");
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${
        waitlistOpen ? "" : "landing-blend-cursor"
      }`}
    >
      <BlendCursor enabled={!waitlistOpen} />
      <ScrollToTopButton />
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero */}
      <div
        ref={heroRef}
        id="hero-section"
        className="relative flex min-h-screen items-center overflow-hidden"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform"
          style={{ y: orbsY, opacity: heroOpacity }}
          aria-hidden
        >
          <div
            className="hero-blob hero-blob-float-a absolute -right-40 -top-40 h-80 w-80 rounded-full opacity-70 mix-blend-multiply"
            style={{ backgroundColor: "#FFD511" }}
          />
          <div
            className="hero-blob hero-blob-float-b absolute -bottom-40 -left-40 h-80 w-80 rounded-full opacity-70 mix-blend-multiply"
            style={{ backgroundColor: "#FFA500" }}
          />
          <div
            className="hero-blob hero-blob-float-c absolute left-40 top-40 h-80 w-80 rounded-full opacity-70 mix-blend-multiply"
            style={{ backgroundColor: "#FF8C00" }}
          />
        </motion.div>

        <CursorFollow
          containerSelector="#hero-section"
          cycleMode="sequential"
        />

        <motion.div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5 sm:px-8"
          style={{ opacity: heroOpacity }}
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex max-w-full cursor-default select-none items-baseline justify-center font-bold text-gray-900"
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(48px, 10vw, 180px)",
              lineHeight: "0.9",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
            aria-label="Ahhh Yaotu"
          >
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.7 }}
              className="shrink-0 text-gray-900"
              style={{
                fontSize: "0.58em",
                fontWeight: 600,
                letterSpacing: "0.04em",
                marginRight: "0.28em",
              }}
            >
              Ahhh
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.85 }}
              className="shrink-0 text-gray-900"
            >
              Yaotu
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute left-0 right-0 z-10"
          style={{
            bottom: "clamp(1.25rem, 4vh, 2.5rem)",
            opacity: heroOpacity,
            paddingLeft: "clamp(1.25rem, 4vw, 2rem)",
            paddingRight: "clamp(1.25rem, 4vw, 2rem)",
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 1 }}
            className="mx-auto text-center text-gray-700"
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 500,
              lineHeight: 1.5,
              letterSpacing: "0.01em",
              fontSize: "clamp(0.8125rem, 1.4vw + 0.55rem, 1.125rem)",
              maxWidth: "min(36rem, 92vw)",
            }}
          >
            {t(
              "landing.hero.tagline",
              "Connect with verified locals who match your interests, travel style, and schedule."
            )}
          </motion.p>
        </motion.div>
      </div>

      {/* Mid CTAs */}
      <section className="relative z-10 px-4 py-20 sm:py-24 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-10 max-w-2xl text-gray-900 sm:mb-12"
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              fontSize: "clamp(1.35rem, 2.5vw + 0.6rem, 2.25rem)",
            }}
          >
            {t(
              "landing.hero.ctaIntro",
              "Start as a traveler or a local — join early and shape the journey with us."
            )}
          </motion.p>
          <div className="flex w-full max-w-2xl flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.12 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="h-auto min-h-[3.25rem] w-full rounded-full px-8 py-4 text-base font-semibold shadow-md sm:w-auto sm:px-10 sm:text-lg"
                onClick={() => setWaitlistOpen(true)}
                data-cursor-hover
              >
                {t(
                  "landing.hero.waitlistCta",
                  "Join the Waitlist to Explore Guides"
                )}
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="h-auto min-h-[3.25rem] w-full rounded-full border-2 px-8 py-4 text-base font-semibold sm:w-auto sm:px-10 sm:text-lg"
                onClick={scrollToCta}
                data-cursor-hover
              >
                {t("landing.hero.guideCta", "Become a Local Guide")}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative overflow-hidden bg-white/50 py-20 backdrop-blur-sm dark:bg-gray-800/50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {t("landing.features.title", "Why Choose YaoTu?")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              {t(
                "landing.features.subtitle",
                "Explore the city with locals who know it best."
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative text-center"
                whileHover={{ y: -10 }}
                data-cursor-hover
              >
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    boxShadow: "0 20px 40px rgba(255, 213, 17, 0.3)",
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl text-white shadow-md transition-shadow group-hover:shadow-lg"
                  style={{
                    background: "linear-gradient(to right, #FFD511, #FFA500)",
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.icon}
                  </motion.div>
                </motion.div>
                <motion.h3
                  className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
                  whileHover={{ color: "#E5A800" }}
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
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-gray-800/50 dark:to-gray-700/50" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How it works */}
      <section className="relative overflow-hidden bg-white/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center px-2 text-center sm:px-6 lg:px-10 lg:pr-12"
            >
              <h2 className="mb-3 flex min-h-[2.5rem] items-end justify-center text-2xl font-bold text-gray-900 sm:min-h-[2.75rem] sm:text-3xl">
                {t("landing.howTraveler.title", "How It Works as Traveler")}
              </h2>
              <p className="mb-8 min-h-[3rem] max-w-sm text-base text-gray-600 sm:min-h-[3.25rem] sm:text-lg">
                {t(
                  "landing.howTraveler.subtitle",
                  "Book a local experience in just three simple steps"
                )}
              </p>
              <StepFlow steps={travelerSteps} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mt-14 flex flex-col items-center px-2 text-center sm:px-6 lg:mt-0 lg:border-l lg:border-gray-200 lg:px-10 lg:pl-12"
            >
              <h2 className="mb-3 flex min-h-[2.5rem] items-end justify-center text-2xl font-bold text-gray-900 sm:min-h-[2.75rem] sm:text-3xl">
                {t("landing.howGuide.title", "How It Works as Guide")}
              </h2>
              <p className="mb-8 min-h-[3rem] max-w-sm text-base text-gray-600 sm:min-h-[3.25rem] sm:text-lg">
                {t(
                  "landing.howGuide.subtitle",
                  "Book a local experience in just three simple steps"
                )}
              </p>
              <StepFlow steps={guideSteps} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative overflow-hidden py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {t("landing.team.title", "From Our Team")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t(
                "landing.team.subtitle",
                "Built by people who care about better travel experiences."
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-stretch">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80"
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                }}
                data-cursor-hover
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <p className="relative z-10 mb-4 flex-1 italic text-gray-600 dark:text-gray-300">
                  &ldquo;{member.text}&rdquo;
                </p>
                <div className="relative z-10 mt-auto font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ */}
      <section className="bg-white/50 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("landing.faq.title", "FAQ")}
            </h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white/90"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-gray-900 transition-colors hover:bg-yellow-50/80"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    data-cursor-hover
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 leading-relaxed text-gray-600">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <motion.section
        ref={ctaRef}
        id="become-guide-cta"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(to right, #FFD511, #FFA500)" }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ y: ctaParallaxY }}
          aria-hidden
        >
          <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-white blur-xl" />
          <div className="absolute bottom-10 right-10 h-24 w-24 rounded-full bg-white blur-xl" />
          <div className="absolute left-1/4 top-1/2 h-16 w-16 rounded-full bg-white blur-xl" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-6 text-3xl font-bold text-white sm:text-4xl"
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 30px rgba(255, 255, 255, 0.5)",
            }}
          >
            {t("landing.cta.title", "Ready to Explore Japan?")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-8 text-xl text-white"
            whileHover={{ scale: 1.02 }}
          >
            {t(
              "landing.cta.subtitle",
              "Share your expertise and connect with curious travelers"
            )}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full bg-white px-8 py-3 font-semibold shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-2xl"
                style={{ color: "#FFD511" }}
                onClick={handleBecomeGuide}
                data-cursor-hover
              >
                <motion.span
                  className="relative z-10 flex items-center"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  {t("landing.cta.becomeGuide", "Apply to Become a Guide")}
                  <motion.span
                    className="ml-2 inline-flex"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </motion.span>
                <span className="absolute inset-0 translate-x-[-100%] bg-yellow-100 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </Button>
            </motion.div>
            <motion.button
              type="button"
              onClick={handleViewApplicationStatus}
              className="mt-2 text-lg text-white/80 underline transition-colors duration-300 hover:text-white"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-cursor-hover
            >
              {t(
                "landing.cta.viewApplicationStatus",
                "Already Applied? View Your Application Status"
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Waitlist modal */}
      <AnimatePresence>
        {waitlistOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              aria-label="Close"
              onClick={closeWaitlist}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="waitlist-title"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={closeWaitlist}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>

              {!waitlistSubmitted ? (
                <>
                  <h3
                    id="waitlist-title"
                    className="mb-2 pr-8 text-2xl font-bold text-gray-900"
                  >
                    {t("landing.waitlist.title", "Join the Waitlist")}
                  </h3>
                  <p className="mb-6 text-sm text-gray-600 sm:text-base">
                    {t(
                      "landing.waitlist.subtitle",
                      "Leave your name and email — we’ll let you know when you can explore guides."
                    )}
                  </p>
                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="waitlist-name"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        {t("landing.waitlist.name", "Name")}
                      </label>
                      <input
                        id="waitlist-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={waitlistName}
                        onChange={(e) => setWaitlistName(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-[#FFD511] focus:ring-2 focus:ring-[#FFD511]/40"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="waitlist-email"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        {t("landing.waitlist.email", "Email")}
                      </label>
                      <input
                        id="waitlist-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:border-[#FFD511] focus:ring-2 focus:ring-[#FFD511]/40"
                        placeholder="you@example.com"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-full py-6 font-semibold"
                      data-cursor-hover
                    >
                      {t("landing.waitlist.submit", "Join Waitlist")}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="py-4 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    {t("landing.waitlist.successTitle", "You're on the list")}
                  </h3>
                  <p className="mb-6 text-gray-600">
                    {t(
                      "landing.waitlist.successBody",
                      "Thanks! We’ll reach out when guides are ready to explore."
                    )}
                  </p>
                  <Button
                    className="rounded-full px-8"
                    onClick={closeWaitlist}
                    data-cursor-hover
                  >
                    {t("common.close", "Close")}
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
