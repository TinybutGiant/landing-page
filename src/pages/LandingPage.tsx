import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";
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
import TeamMemberMarquee, {
  type TeamMemberCard,
} from "@/components/TeamMemberMarquee";
import { getMarketplaceUrl } from "@/lib/yaotuAuthRuntime";

const DISPLAY_FONT =
  '"Open Runde", "Helvetica Neue", Helvetica, Arial, sans-serif';

type StepItem = {
  title: string;
  image: string;
  description: string;
};

const StepFlow = ({
  steps,
  label,
  activeIndex,
  onActiveChange,
  title,
  eyebrow,
  description,
  ctaLabel,
  onCtaClick,
  primary = false,
  imageFirstOnDesktop = false,
}: {
  steps: StepItem[];
  label: string;
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  title: string;
  eyebrow?: string;
  description: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  primary?: boolean;
  imageFirstOnDesktop?: boolean;
}) => {
  const [internalActive, setInternalActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const active = activeIndex ?? internalActive;
  const current = steps[active];

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, next));
    if (clamped === active) return;
    setDirection(clamped > active ? 1 : -1);
    setInternalActive(clamped);
    onActiveChange?.(clamped);
  };

  const canGoPrev = active > 0;
  const canGoNext = active < steps.length - 1;

  const media = (
    <img
      src={current.image}
      alt={current.title}
      className="h-full w-full object-cover object-top"
      loading="lazy"
      draggable={false}
    />
  );

  const ctaClasses = primary
    ? "h-auto min-h-[3.5rem] whitespace-normal rounded-full px-8 py-4 text-center text-base font-semibold leading-snug shadow-md sm:text-lg"
    : "h-auto min-h-[3.5rem] whitespace-normal rounded-full border-2 border-[#FFD511] bg-white px-8 py-4 text-center text-base font-semibold leading-snug text-gray-900 shadow-none hover:bg-[#FFF7CC] sm:text-lg";

  const sideArrowClass =
    "absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900/70 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-gray-900/90 sm:h-12 sm:w-12";

  const badgeClass = primary
    ? "inline-flex w-fit shrink-0 rounded-full bg-[#FFD511]/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-900"
    : "inline-flex w-fit shrink-0 rounded-full border border-[#FFD511] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-700";

  return (
    <div className="w-full">
      <div className="relative px-5 sm:px-12 lg:px-14">
        {canGoPrev ? (
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label={`${label}: previous step`}
            className={`${sideArrowClass} left-0`}
            data-cursor-hover
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : null}
        {canGoNext ? (
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label={`${label}: next step`}
            className="absolute top-1/2 right-0 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFD511] text-gray-900 shadow-lg transition-colors hover:bg-[#E5C00F] sm:h-12 sm:w-12"
            data-cursor-hover
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : null}

        <div className="overflow-hidden">
          <div
            className={`grid items-start gap-6 p-1 sm:gap-8 sm:p-2 lg:gap-10 lg:p-3 ${
              imageFirstOnDesktop
                ? "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:[grid-template-areas:'media_copy']"
                : "lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:[grid-template-areas:'copy_media']"
            }`}
          >
            <div className="order-1 flex min-w-0 flex-col justify-center text-left lg:[grid-area:copy]">
              <div className="flex items-center gap-2.5">
                {steps.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`${label}: step ${index + 1}`}
                    aria-current={index === active}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors sm:h-9 sm:w-9 ${
                      index === active
                        ? "bg-[#FFD511] text-gray-900"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    }`}
                    data-cursor-hover
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.title}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -28 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="lg:min-h-[29rem]"
                >
                  <h3 className="mt-3 max-w-xl text-balance text-2xl font-bold leading-snug text-gray-900 sm:mt-4 sm:text-3xl lg:text-[2.15rem] lg:leading-[1.2]">
                    {active === 0 ? title : current.title}
                  </h3>

                  {eyebrow ? (
                    <span className={`${badgeClass} mt-3`}>{eyebrow}</span>
                  ) : null}

                  {active === 0 ? (
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                      {description}
                    </p>
                  ) : null}

                  <div
                    className={`max-w-xl border-l-2 border-[#FFD511] pl-4 sm:pl-5 ${
                      active === 0 ? "mt-6 sm:mt-7" : "mt-4 sm:mt-5"
                    }`}
                  >
                    {active === 0 ? (
                      <>
                        <p className="flex items-start gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 sm:gap-2.5">
                          <span
                            className="shrink-0 font-normal normal-case tracking-normal text-gray-500"
                            aria-hidden
                          >
                            {["①", "②", "③"][active]}
                          </span>
                          <span>{current.title}</span>
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700 sm:text-base">
                          {current.description}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                        {current.description}
                      </p>
                    )}
                  </div>

                  {ctaLabel && onCtaClick && (
                    <div className="mt-7 hidden lg:block">
                      <Button
                        size="lg"
                        variant={primary ? "default" : "outline"}
                        className={ctaClasses}
                        onClick={onCtaClick}
                        data-cursor-hover
                      >
                        {ctaLabel}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="order-2 w-full min-w-0 self-start lg:[grid-area:media]">
              <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-gray-200 bg-[#fbfaf3]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current.title}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -28 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="h-full w-full"
                  >
                    {media}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

            {ctaLabel && onCtaClick && (
              <div className="order-3 lg:hidden">
                <Button
                  size="lg"
                  variant={primary ? "default" : "outline"}
                  className={`${ctaClasses} w-full justify-center`}
                  onClick={onCtaClick}
                  data-cursor-hover
                >
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2.5 lg:-mt-24">
        {steps.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`${label}: step ${index + 1}`}
            aria-current={index === active}
            className={`h-2.5 rounded-full transition-all ${
              index === active
                ? "w-7 bg-[#FFD511]"
                : "w-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
            data-cursor-hover
          />
        ))}
      </div>
    </div>
  );
};

const FlowStoryRow = ({
  title,
  eyebrow,
  description,
  steps,
  activeStep,
  onStepChange,
  label,
  ctaLabel,
  onCtaClick,
  primary = false,
  tone = "white",
  imageFirstOnDesktop = false,
}: {
  title: string;
  eyebrow?: string;
  description: string;
  steps: StepItem[];
  activeStep: number;
  onStepChange: (index: number) => void;
  label: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  primary?: boolean;
  tone?: "white" | "warm";
  imageFirstOnDesktop?: boolean;
}) => {
  return (
    <div className="relative py-10 sm:py-12 lg:py-14">
      {tone === "warm" ? (
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-[#fbfaf3]"
          aria-hidden
        />
      ) : null}
      <div className="relative">
        <StepFlow
          steps={steps}
          label={label}
          activeIndex={activeStep}
          onActiveChange={onStepChange}
          title={title}
          eyebrow={eyebrow}
          description={description}
          ctaLabel={ctaLabel}
          onCtaClick={onCtaClick}
          primary={primary}
          imageFirstOnDesktop={imageFirstOnDesktop}
        />
      </div>
    </div>
  );
};

const LandingPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated } = useAuth();
  const { messages, locale } = useLanguage();
  const t = (key: string, fallback: string) => messages[key] || fallback;

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [guideActiveStep, setGuideActiveStep] = useState(0);
  const [guideOperationsActiveStep, setGuideOperationsActiveStep] = useState(0);
  const [travelerActiveStep, setTravelerActiveStep] = useState(0);
  const travelerWaitlistUrl = getMarketplaceUrl(
    `/signup?locale=${encodeURIComponent(locale)}`
  );

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
        "Every Guide is verified, with safety features built into every booking."
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
        "Go beyond generic routes and see Japan through local context."
      ),
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t("landing.features.expertGuides", "Expert Guides"),
      description: t(
        "landing.features.expertGuidesDesc",
        "Verified local Guides with practical knowledge of Japan's neighborhoods, culture, and everyday details."
      ),
    },
  ];

  const travelerSteps: StepItem[] = [
    {
      title: t("landing.howTraveler.step1", "Discover Guides"),
      description: t(
        "landing.howTraveler.step1Desc",
        "Browse local Guides by city, interests, language, and the kind of experience you want."
      ),
      image: "/screenshots/traveler-discover.png",
    },
    {
      title: t(
        "landing.howTraveler.step2",
        "Explore Guide profiles and experiences"
      ),
      description: t(
        "landing.howTraveler.step2Desc",
        "Explore each Guide's background, service style, and available experiences before you decide."
      ),
      image: "/screenshots/traveler-profile.png",
    },
    {
      title: t("landing.howTraveler.step3", "Choose a time and book"),
      description: t(
        "landing.howTraveler.step3Desc",
        "Choose a time and complete your booking directly through Yaotu when the marketplace opens."
      ),
      image: "/screenshots/traveler-book.png",
    },
  ];

  const guideSteps: StepItem[] = [
    {
      title: t("landing.howGuide.step1", "Complete your profile"),
      description: t(
        "landing.howGuide.step1Desc",
        "Add your local knowledge, service areas, availability, and qualification materials."
      ),
      image: "/screenshots/guide-qualification.png",
    },
    {
      title: t("landing.howGuide.step2", "Submit your application"),
      description: t(
        "landing.howGuide.step2Desc",
        "Send your Guide application for review once your profile details are ready."
      ),
      image: "/screenshots/guide-apply.png",
    },
    {
      title: t("landing.howGuide.step3", "View your application status"),
      description: t(
        "landing.howGuide.step3Desc",
        "Sign in or create an account to return anytime and continue from your current progress."
      ),
      image: "/screenshots/guide-status.png",
    },
  ];

  const guideOperationsSteps: StepItem[] = [
    {
      title: t("landing.howGuideOperations.step1", "Publish your experience"),
      description: t(
        "landing.howGuideOperations.step1Desc",
        "Set your experience details, location, availability, duration, and pricing before making it available to Travelers."
      ),
      image: "/screenshots/guide-publish.png",
    },
    {
      title: t("landing.howGuideOperations.step2", "Manage Traveler bookings"),
      description: t(
        "landing.howGuideOperations.step2Desc",
        "Review upcoming bookings, Traveler details, schedules, and booking status from your Guide workspace."
      ),
      image: "/screenshots/guide-bookings.png",
    },
    {
      title: t("landing.howGuideOperations.step3", "Track earnings and payouts"),
      description: t(
        "landing.howGuideOperations.step3Desc",
        "See your earnings, payout status, and payout history, and manage withdrawals through Yaotu."
      ),
      image: "/screenshots/guide-earnings.png",
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

  const coreTeam: TeamMemberCard[] = [
    {
      id: "noa",
      name: t("landing.teamMembers.noaName", "Noa"),
      role: t("landing.teamMembers.noaRole", "User Research"),
      summary: t(
        "landing.teamMembers.noaSummary",
        "Turns Traveler and Guide feedback into product decisions."
      ),
      bio: t(
        "landing.teamMembers.noaBio",
        "Noa listens to Travelers and Guides across Japan, turning real feedback into product decisions that keep Yaotu grounded in everyday travel needs."
      ),
      links: ["contact"],
    },
    {
      id: "maya",
      name: t("landing.teamMembers.mayaName", "Maya"),
      role: t("landing.teamMembers.mayaRole", "Head of Product Design"),
      summary: t(
        "landing.teamMembers.mayaSummary",
        "Designs the Traveler and Guide experience."
      ),
      bio: t(
        "landing.teamMembers.mayaBio",
        "Maya shapes how Travelers and Guides experience Yaotu, focusing on clarity, trust, and the small details that make local travel feel personal."
      ),
      links: ["linkedin", "portfolio", "contact"],
    },
    {
      id: "kai",
      name: t("landing.teamMembers.kaiName", "Kai"),
      role: t("landing.teamMembers.kaiRole", "Head of Product & Growth"),
      summary: t(
        "landing.teamMembers.kaiSummary",
        "Connects early Guides and launch strategy."
      ),
      bio: t(
        "landing.teamMembers.kaiBio",
        "Kai helps bring Yaotu's first Guide community to life, connecting early partners, launch strategy, and the story behind the product."
      ),
      links: ["linkedin", "contact"],
    },
    {
      id: "lin",
      name: t("landing.teamMembers.linName", "Lin"),
      role: t("landing.teamMembers.linRole", "Head of Engineering"),
      summary: t(
        "landing.teamMembers.linSummary",
        "Builds the systems behind bookings and onboarding."
      ),
      bio: t(
        "landing.teamMembers.linBio",
        "Lin builds the systems behind Yaotu, from guide onboarding to booking flows, with a focus on reliability, speed, and safe releases."
      ),
      links: ["linkedin", "portfolio"],
    },
    {
      id: "alex",
      name: t("landing.teamMembers.alexName", "Alex"),
      role: t("landing.teamMembers.alexRole", "Marketing"),
      summary: t(
        "landing.teamMembers.alexSummary",
        "Tells Yaotu's story across channels."
      ),
      bio: t(
        "landing.teamMembers.alexBio",
        "Alex helps tell Yaotu's story across channels, turning product updates and Guide stories into content that reaches future Travelers."
      ),
      links: ["linkedin"],
    },
    {
      id: "sam",
      name: t("landing.teamMembers.samName", "Sam"),
      role: t("landing.teamMembers.samRole", "Operations"),
      summary: t(
        "landing.teamMembers.samSummary",
        "Keeps Guide onboarding and community ops running."
      ),
      bio: t(
        "landing.teamMembers.samBio",
        "Sam supports day-to-day Guide onboarding and community operations, keeping early partners supported as the network grows."
      ),
    },
  ];

  const alumniRowOne: TeamMemberCard[] = [
    {
      id: "rina",
      name: t("landing.teamMembers.rinaName", "Rina"),
      role: t("landing.teamMembers.rinaRole", "Design Intern"),
      bio: t(
        "landing.teamMembers.rinaBio",
        "Rina helped shape early Traveler flows and left after a focused design sprint."
      ),
    },
    {
      id: "jun",
      name: t("landing.teamMembers.junName", "Jun"),
      role: t("landing.teamMembers.junRole", "Engineering Intern"),
      bio: t(
        "landing.teamMembers.junBio",
        "Jun contributed to early booking prototypes before moving on to another role."
      ),
    },
    {
      id: "hana",
      name: t("landing.teamMembers.hanaName", "Hana"),
      role: t("landing.teamMembers.hanaRole", "Research Intern"),
      bio: t(
        "landing.teamMembers.hanaBio",
        "Hana ran early Guide interviews that still inform how we verify local partners."
      ),
    },
    {
      id: "leo",
      name: t("landing.teamMembers.leoName", "Leo"),
      role: t("landing.teamMembers.leoRole", "Growth Intern"),
      bio: t(
        "landing.teamMembers.leoBio",
        "Leo tested early waitlist messaging and community outreach experiments."
      ),
    },
  ];

  const alumniRowTwo: TeamMemberCard[] = [
    {
      id: "mia",
      name: t("landing.teamMembers.miaName", "Mia"),
      role: t("landing.teamMembers.miaRole", "Marketing Intern"),
      bio: t(
        "landing.teamMembers.miaBio",
        "Mia drafted the first Guide stories that introduced Yaotu to early travelers."
      ),
    },
    {
      id: "owen",
      name: t("landing.teamMembers.owenName", "Owen"),
      role: t("landing.teamMembers.owenRole", "Ops Intern"),
      bio: t(
        "landing.teamMembers.owenBio",
        "Owen supported the first Guide onboarding batch before wrapping a short placement."
      ),
    },
    {
      id: "yuki",
      name: t("landing.teamMembers.yukiName", "Yuki"),
      role: t("landing.teamMembers.yukiRole", "Content Intern"),
      bio: t(
        "landing.teamMembers.yukiBio",
        "Yuki helped translate early product copy across English, Chinese, and Japanese."
      ),
    },
    {
      id: "tom",
      name: t("landing.teamMembers.tomName", "Tom"),
      role: t("landing.teamMembers.tomRole", "Product Intern"),
      bio: t(
        "landing.teamMembers.tomBio",
        "Tom sketched early marketplace concepts during a short product exploration."
      ),
    },
  ];

  const faqs = [
    {
      q: t("landing.faq.q1", "What is Ahhh Yaotu?"),
      a: t(
        "landing.faq.a1",
        "Ahhh Yaotu is building a Japan-focused marketplace that connects Travelers with verified local Guides for personal, flexible experiences."
      ),
    },
    {
      q: t("landing.faq.q2", "How are local guides verified?"),
      a: t(
        "landing.faq.a2",
        "Every Guide goes through a review and verification process so the first local Guide network in Japan starts with safety and trust."
      ),
    },
    {
      q: t("landing.faq.q3", "How do I get early access?"),
      a: t(
        "landing.faq.a3",
        "Select Get Traveler Early Access, leave your name and email, and confirm your email. Once the first local Guides in Japan are ready, we'll prioritize inviting confirmed Travelers to experience Yaotu."
      ),
    },
    {
      q: t("landing.faq.q4", "How can I become a local guide?"),
      a: t(
        "landing.faq.a4",
        "Select Become a Local Guide to open the application. Share your Japan local knowledge, service preferences, and availability."
      ),
    },
  ];

  const handleViewApplicationStatus = () => {
    window.location.href = isAuthenticated
      ? "/view-application-status"
      : "/login?redirect=/view-application-status";
  };

  const handleBecomeGuide = () => {
    window.location.href = "/become-guide";
  };

  const handleTravelerWaitlist = () => {
    window.location.href = travelerWaitlistUrl;
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 landing-blend-cursor"
    >
      <BlendCursor enabled />
      <ScrollToTopButton />
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero */}
      <div
        ref={heroRef}
        id="hero-section"
        className="landing-hero relative flex min-h-screen items-center overflow-hidden"
        style={
          {
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
          <div className="relative flex max-w-full -translate-y-[2vh] flex-col items-center text-center sm:-translate-y-[1vh]">
            <div
              className="pointer-events-none absolute left-1/2 top-[46%] -z-10 h-[56vh] w-[96vw] max-w-6xl -translate-x-1/2 -translate-y-1/2"
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
              className="mx-auto text-center text-gray-700"
              style={{
                fontFamily: DISPLAY_FONT,
                fontWeight: 500,
                lineHeight: 1.5,
                letterSpacing: "0.01em",
                fontSize: "var(--hero-tagline-size)",
                width: "min(40rem, 92vw)",
                marginTop: "calc(var(--hero-title-size) * 0.22)",
                textShadow:
                  "0 0 14px rgba(255,255,255,0.95), 0 0 32px rgba(255,255,255,0.75)",
              }}
            >
              {t(
                "landing.hero.tagline",
                "Apply to become one of our first local Guides in Japan, or register for Traveler Early Access."
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.35 }}
              className="pointer-events-auto mt-7 flex w-full max-w-xl flex-col items-stretch gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4"
            >
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="h-auto min-h-[3.25rem] w-full whitespace-normal rounded-full px-6 py-3.5 text-center text-sm font-semibold leading-snug shadow-md sm:w-auto sm:min-w-[14rem] sm:px-8 sm:text-base"
                  onClick={handleBecomeGuide}
                  data-cursor-hover
                >
                  {t("landing.hero.guideCta", "Become a Local Guide")}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto min-h-[3.25rem] w-full whitespace-normal rounded-full border-2 border-[#FFD511] bg-white/95 px-6 py-3.5 text-center text-sm font-semibold leading-snug text-gray-900 shadow-none hover:bg-[#FFF7CC] sm:w-auto sm:min-w-[14rem] sm:px-8 sm:text-base"
                  onClick={handleTravelerWaitlist}
                  data-cursor-hover
                >
                  {t("landing.hero.waitlistCta", "Get Traveler Early Access")}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>


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
                "Explore Japan with locals who know the places, habits, and context behind the route."
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
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24">
          <div className="mb-14 text-center sm:mb-16">
            <h2 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {t("landing.howTraveler.sectionTitle", "How Yaotu works")}
            </h2>
          </div>

          <div className="flex flex-col">
            <FlowStoryRow
              primary
              title={t(
                "landing.howGuide.title",
                "Become a local Guide with Yaotu"
              )}
              eyebrow={t("landing.howGuide.eyebrow", "Applications open")}
              description={t(
                "landing.howGuide.subtitle",
                "Join the first community of local Guides we're building in Japan. Complete your profile, submit your application, then sign in to track your progress."
              )}
              steps={guideSteps}
              activeStep={guideActiveStep}
              onStepChange={setGuideActiveStep}
              label={t("landing.howGuide.title", "Become a local Guide with Yaotu")}
              ctaLabel={t("landing.howGuide.cta", "Become a Local Guide")}
              onCtaClick={handleBecomeGuide}
            />

            <FlowStoryRow
              imageFirstOnDesktop
              tone="warm"
              title={t(
                "landing.howGuideOperations.title",
                "Start hosting with Yaotu"
              )}
              eyebrow={t(
                "landing.howGuideOperations.eyebrow",
                "After approval"
              )}
              description={t(
                "landing.howGuideOperations.subtitle",
                "Once approved, create and publish your local experiences, manage Traveler bookings, and track your earnings and payouts directly through Yaotu."
              )}
              steps={guideOperationsSteps}
              activeStep={guideOperationsActiveStep}
              onStepChange={setGuideOperationsActiveStep}
              label={t(
                "landing.howGuideOperations.title",
                "Start hosting with Yaotu"
              )}
              ctaLabel={t("landing.howGuide.cta", "Become a Local Guide")}
              onCtaClick={handleBecomeGuide}
            />

            <FlowStoryRow
              title={t(
                "landing.howTraveler.title",
                "Preview the Traveler experience"
              )}
              eyebrow={t("landing.howTraveler.eyebrow", "Coming Soon")}
              description={t(
                "landing.howTraveler.subtitle",
                "The Traveler marketplace is coming soon. You'll be able to discover local Guides in Japan, explore their profiles and experiences, and book directly through Yaotu. Register for Early Access now."
              )}
              steps={travelerSteps}
              activeStep={travelerActiveStep}
              onStepChange={setTravelerActiveStep}
              label={t(
                "landing.howTraveler.title",
                "Preview the Traveler experience"
              )}
              ctaLabel={t(
                "landing.howTraveler.cta",
                "Get Traveler Early Access"
              )}
              onCtaClick={handleTravelerWaitlist}
            />
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

      {/* Meet the team */}
      <TeamMemberMarquee
        title={t("landing.teamMembers.title", "Meet the team")}
        featuredSubtitle={t(
          "landing.teamMembers.featuredSubtitle",
          "The people you'll meet week to week."
        )}
        featured={coreTeam}
        rows={[alumniRowOne, alumniRowTwo]}
        closeLabel={t("common.close", "Close")}
        connectLabel={t("landing.teamMembers.connect", "Connect")}
        linkedInLabel={t("landing.teamMembers.linkedIn", "LinkedIn")}
        portfolioLabel={t("landing.teamMembers.portfolio", "Portfolio")}
        contactLabel={t("landing.teamMembers.contact", "Contact")}
      />

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
            {t("landing.cta.title", "Ready to help shape travel in Japan?")}
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
              "Apply as a local Guide and help build Yaotu's first Japan experience network."
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
                  {t("landing.cta.becomeGuide", "Apply to Become a Local Guide")}
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

    </div>
  );
};

export default LandingPage;
