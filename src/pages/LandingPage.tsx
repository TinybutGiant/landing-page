import {
  useRef,
  useState,
  FormEvent,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Heart,
  Globe,
  Shield,
  Plus,
  X,
} from "lucide-react";
import CursorFollow from "@/components/CursorFollow";
import BlendCursor from "@/components/BlendCursor";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { api } from "@/lib/apiClient";

const DISPLAY_FONT =
  '"Open Runde", "Helvetica Neue", Helvetica, Arial, sans-serif';

type StepItem = {
  step: string;
  title: string;
  image: string;
  description: string;
};

const CLOSE_DELAY_MS = 180;

const StepFlow = ({ steps, label }: { steps: StepItem[]; label: string }) => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [panelOpen, setPanelOpen] = useState(false);
  const [openedByTouch, setOpenedByTouch] = useState(false);
  const isTouchRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(
      () => setPanelOpen(false),
      CLOSE_DELAY_MS
    );
  };

  const closePanel = () => {
    cancelClose();
    setPanelOpen(false);
  };

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    if (!panelOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panelOpen]);

  const goTo = (next: number) => {
    const clamped = ((next % steps.length) + steps.length) % steps.length;
    if (clamped === active) return;
    if (active === steps.length - 1 && clamped === 0) setDirection(1);
    else if (active === 0 && clamped === steps.length - 1) setDirection(-1);
    else setDirection(clamped > active ? 1 : -1);
    setActive(clamped);
  };

  const current = steps[active];

  const navControls = (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label={`${label}: previous step`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:border-[#FFD511] hover:bg-[#FFD511] hover:text-gray-900"
          data-cursor-hover
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label={`${label}: next step`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:border-[#FFD511] hover:bg-[#FFD511] hover:text-gray-900"
          data-cursor-hover
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-2.5">
        {steps.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`${label}: step ${index + 1}`}
            aria-current={index === active}
            className={`h-2.5 rounded-full transition-all ${
              index === active
                ? "w-6 bg-[#FFD511]"
                : "w-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
            data-cursor-hover
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.title}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -24 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onPointerDown={(event) => {
            isTouchRef.current = event.pointerType !== "mouse";
          }}
          onPointerEnter={(event) => {
            if (event.pointerType !== "mouse") return;
            cancelClose();
            setOpenedByTouch(false);
            setPanelOpen(true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") scheduleClose();
          }}
          onTap={() => {
            if (!isTouchRef.current) return;
            setOpenedByTouch(true);
            setPanelOpen((open) => !open);
          }}
          className="w-full"
        >
          <div className="mb-3 flex h-7 items-center justify-center text-center">
            <span className="text-base font-semibold text-gray-900 sm:text-lg">
              {current.step} {current.title}
            </span>
          </div>
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.3 }}
            className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-md"
            data-cursor-hover
          >
            <img
              src={current.image}
              alt={current.title}
              className="h-full w-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6">{navControls}</div>

      {createPortal(
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${
                  openedByTouch ? "pointer-events-auto" : ""
                }`}
                onClick={openedByTouch ? closePanel : undefined}
                aria-hidden
              />
              <motion.div
                role="dialog"
                aria-label={`${label}: ${current.title}`}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onMouseEnter={cancelClose}
                onMouseLeave={() => {
                  if (!openedByTouch) scheduleClose();
                }}
                className="pointer-events-auto relative grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white text-left shadow-2xl md:grid-cols-2"
              >
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close"
                  className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm transition-colors hover:text-gray-900 md:hidden"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="order-2 flex flex-col justify-between p-6 sm:p-8 md:order-1 md:p-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        {label}
                      </p>
                      <h4 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                        {current.step} {current.title}
                      </h4>
                      <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                        {current.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-8 border-t border-gray-200 pt-5 md:mt-10">
                    {navControls}
                  </div>
                </div>

                <div className="relative order-1 aspect-[4/3] bg-gray-100 md:order-2 md:aspect-auto md:min-h-[26rem]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={current.image + current.title}
                      src={current.image}
                      alt={current.title}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

const LandingPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated } = useAuth();
  const { messages, locale } = useLanguage();
  const t = (key: string, fallback: string) => messages[key] || fallback;

  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);
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
        "Skip the back-and-forth and book with\u00A0confidence."
      ),
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t("landing.features.authenticExperiences", "Authentic Experiences"),
      description: t(
        "landing.features.authenticExperiencesDesc",
        "Go beyond the guidebooks and see the city like a local."
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
      description: t(
        "landing.howTraveler.step1Desc",
        "Browse verified locals nearby and pick someone whose style fits your trip."
      ),
      image: "/3.jpg",
    },
    {
      step: "②",
      title: t("landing.howTraveler.step2", "Book Instantly"),
      description: t(
        "landing.howTraveler.step2Desc",
        "Choose a time that works, confirm in a few taps, and pay securely."
      ),
      image: "/5.jpg",
    },
    {
      step: "③",
      title: t("landing.howTraveler.step3", "Explore Together"),
      description: t(
        "landing.howTraveler.step3Desc",
        "Meet up and see the city the way someone who lives there sees it."
      ),
      image: "/6.jpg",
    },
  ];

  const guideSteps: StepItem[] = [
    {
      step: "①",
      title: t("landing.howGuide.step1", "Open a Slot"),
      description: t(
        "landing.howGuide.step1Desc",
        "Pick the days and hours you're free. No fixed schedule required."
      ),
      image: "/3.jpg",
    },
    {
      step: "②",
      title: t("landing.howGuide.step2", "Book Instantly"),
      description: t(
        "landing.howGuide.step2Desc",
        "Travelers book your slot directly, and payment runs through the platform."
      ),
      image: "/5.jpg",
    },
    {
      step: "③",
      title: t("landing.howGuide.step3", "Explore Together"),
      description: t(
        "landing.howGuide.step3Desc",
        "Take them to your favorite spots and share the city you know best."
      ),
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
      q: t("landing.faq.q3", "How do I get early access?"),
      a: t(
        "landing.faq.a3",
        "Select Get Early Access, leave your name and email, and confirm your email. Once our first local guides are ready, we'll prioritize inviting confirmed travelers to experience Yaotu."
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
    window.location.href = "/become-guide";
  };

  const handleWaitlistSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!waitlistName.trim() || !waitlistEmail.trim() || waitlistSubmitting) return;

    setWaitlistError(null);
    setWaitlistSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      await api.post("/api/v2/waitlist", {
        name: waitlistName.trim(),
        email: waitlistEmail.trim(),
        locale,
        source: "guide_landing",
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
      });
    } catch {
      setWaitlistError(
        t(
          "landing.waitlist.error",
          "We couldn't submit your request. Please check your email address and try again."
        )
      );
      return;
    } finally {
      setWaitlistSubmitting(false);
    }
    setWaitlistSubmitted(true);
  };

  const closeWaitlist = () => {
    setWaitlistOpen(false);
    setWaitlistSubmitted(false);
    setWaitlistName("");
    setWaitlistEmail("");
    setWaitlistError(null);
    setWaitlistSubmitting(false);
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
        style={
          {
            "--hero-title-size": "clamp(30px, 9vw, 170px)",
            "--hero-tagline-size":
              "clamp(0.95rem, calc(var(--hero-title-size) * 0.185), 1.6rem)",
          } as CSSProperties
        }
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
          <div className="relative max-w-full">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[46vh] w-[96vw] max-w-6xl -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,255,255,0.92) 35%, rgba(255,255,255,0.55) 65%, rgba(255,255,255,0))",
              }}
              aria-hidden
            />
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex max-w-full cursor-default select-none items-baseline justify-center whitespace-nowrap font-bold text-gray-900"
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: "var(--hero-title-size)",
                lineHeight: "0.9",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                textShadow:
                  "0 0 16px rgba(255,255,255,0.95), 0 0 40px rgba(255,255,255,0.8)",
              }}
              aria-label="www.ahhh-yaotu.com"
            >
              <motion.span
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.7 }}
                className="shrink-0 text-gray-900"
                style={{ fontSize: "0.47em", fontWeight: 500 }}
              >
                www.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.85 }}
                className="shrink-0 text-gray-900"
              >
                ahhh-yaotu
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 1 }}
                className="shrink-0 text-gray-900"
                style={{ fontSize: "0.47em", fontWeight: 500 }}
              >
                .com
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 1.15 }}
              className="absolute left-0 right-0 top-full mx-auto text-center text-gray-700"
              style={{
                fontFamily: DISPLAY_FONT,
                fontWeight: 500,
                lineHeight: 1.5,
                letterSpacing: "0.01em",
                fontSize: "var(--hero-tagline-size)",
                width: "min(44rem, 92vw)",
                marginTop: "calc(var(--hero-title-size) * 0.3)",
                textShadow:
                  "0 0 14px rgba(255,255,255,0.95), 0 0 32px rgba(255,255,255,0.75)",
              }}
            >
              {t(
                "landing.hero.tagline",
                "Connect with verified locals who match your interests, travel style, and schedule."
              )}
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Mid CTAs */}
      <section className="relative z-10 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-14 w-full text-center sm:mb-16"
          >
            <p
              className="mb-4 text-gray-900"
              style={{
                fontFamily: DISPLAY_FONT,
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                fontSize: "clamp(1.35rem, 2.5vw + 0.6rem, 2.25rem)",
              }}
            >
              {t("landing.hero.ctaIntro", "Start as a traveler or a local")}
            </p>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t(
                "landing.hero.ctaIntroSub",
                "Join early and shape the journey with us."
              )}
            </p>
          </motion.div>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.12 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button
                size="lg"
                className="h-auto min-h-[3.5rem] w-full whitespace-normal rounded-full px-5 py-4 text-center text-sm font-semibold leading-snug shadow-md sm:px-8 sm:text-base lg:text-lg"
                onClick={() => setWaitlistOpen(true)}
                data-cursor-hover
              >
                {t(
                  "landing.hero.waitlistCta",
                  "Get Early Access"
                )}
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button
                size="lg"
                variant="outline"
                className="h-auto min-h-[3.5rem] w-full whitespace-normal rounded-full border-2 px-5 py-4 text-center text-sm font-semibold leading-snug sm:px-8 sm:text-base lg:text-lg"
                onClick={scrollToCta}
                data-cursor-hover
              >
                {t("landing.hero.guideCta", "Become a Local Guide")}
              </Button>
            </motion.div>
          </div>
        </motion.div>
        </div>
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
            <p className="text-xl text-gray-600 dark:text-gray-300">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {t("landing.howTraveler.sectionTitle", "How It Works")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start lg:gap-0">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center text-center lg:pr-12"
            >
              <h3 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                {t("landing.howTraveler.title", "For Travelers")}
              </h3>
              <p className="mb-8 w-full text-base text-gray-600 sm:text-lg">
                {t(
                  "landing.howTraveler.subtitle",
                  "Book a local experience in three simple steps"
                )}
              </p>
              <StepFlow
                steps={travelerSteps}
                label={t("landing.howTraveler.title", "For Travelers")}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center text-center lg:border-l lg:border-gray-200 lg:pl-12"
            >
              <h3 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                {t("landing.howGuide.title", "For Guides")}
              </h3>
              <p className="mb-8 w-full text-base text-gray-600 sm:text-lg">
                {t(
                  "landing.howGuide.subtitle",
                  "Start hosting travelers in three simple steps"
                )}
              </p>
              <StepFlow
                steps={guideSteps}
                label={t("landing.howGuide.title", "For Guides")}
              />
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              viewport={{ once: true }}
              className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start"
            >
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                {t("landing.faq.title", "FAQ")}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {t("landing.faq.subtitle", "Everything you need to know.")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              viewport={{ once: true }}
              className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white/90 lg:col-span-8"
            >
              {faqs.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left font-medium text-gray-900 transition-colors hover:bg-yellow-50/60 sm:px-6"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      data-cursor-hover
                    >
                      <span>{item.q}</span>
                      <Plus
                        className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
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
                          <p className="px-5 pb-5 leading-relaxed text-gray-600 sm:px-6">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
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

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
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
                className="group relative h-auto max-w-full overflow-hidden whitespace-normal rounded-full bg-white px-6 py-3 text-center text-sm font-semibold leading-snug shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-2xl sm:px-8 sm:text-base"
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
                    {t(
                      "landing.waitlist.title",
                      "Join the first group of Yaotu travelers"
                    )}
                  </h3>
                  <p className="mb-6 text-sm text-gray-600 sm:text-base">
                    {t(
                      "landing.waitlist.subtitle",
                      "We're building our first community of trusted local guides. Once they're ready to welcome travelers, we'll invite confirmed members of this list to experience Yaotu first."
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
                    {waitlistError && (
                      <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {waitlistError}
                      </p>
                    )}
                    <Button
                      type="submit"
                      className="w-full rounded-full py-6 font-semibold"
                      disabled={waitlistSubmitting}
                      data-cursor-hover
                    >
                      {waitlistSubmitting
                        ? t("landing.waitlist.submitting", "Submitting...")
                        : t("landing.waitlist.submit", "Get early access")}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="py-4 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    {t(
                      "landing.waitlist.successTitle",
                      "Confirm your email"
                    )}
                  </h3>
                  <p className="mb-6 text-gray-600">
                    {t(
                      "landing.waitlist.successBody",
                      "We've sent a confirmation email. After you confirm, we'll prioritize inviting you when Yaotu opens its first traveler experience."
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
