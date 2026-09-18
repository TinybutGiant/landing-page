import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  Compass,
  Globe2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import CursorFollow from "@/components/CursorFollow";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import TeamMemberMarquee from "@/components/TeamMemberMarquee";
import { FlowStoryRow } from "@/components/HowYaotuWorks";
import { localizeTeamMembers } from "@/data/teamMembers";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/i18n/LanguageProvider";

type StepItem = {
  title: string;
  image: string;
  description: string;
};

const heroImages = [
  "/hero-scene-bamboo.png",
  "/hero-scene-torii.png",
  "/hero-scene-kyoto.png",
  "/hero-scene-fuji.png",
  "/hero-scene-coast.png",
];

const featureIcons: ReactNode[] = [
  <ShieldCheck className="h-6 w-6" aria-hidden key="safe" />,
  <CalendarCheck className="h-6 w-6" aria-hidden key="booking" />,
  <Compass className="h-6 w-6" aria-hidden key="authentic" />,
  <MapPin className="h-6 w-6" aria-hidden key="expert" />,
];

const LandingPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const { isAuthenticated } = useAuth();
  const { messages } = useLanguage();
  const t = (key: string, fallback: string) => messages[key] || fallback;
  const localizedTeamMembers = localizeTeamMembers(t);
  const featuredTeamMembers = localizedTeamMembers.slice(0, 6);
  const teamMemberRows = [
    localizedTeamMembers.slice(6, 10),
    localizedTeamMembers.slice(10),
  ];
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [guideActiveStep, setGuideActiveStep] = useState(0);
  const [guideOperationsActiveStep, setGuideOperationsActiveStep] = useState(0);
  const [travelerActiveStep, setTravelerActiveStep] = useState(0);
  const handleBecomeGuide = () => {
    window.location.href = "/become-guide";
  };

  const handleTravelerWaitlist = () => {
    window.location.href = "/early-access";
  };

  const handleViewApplicationStatus = () => {
    window.location.href = isAuthenticated
      ? "/view-application-status"
      : "/login?redirect=/view-application-status";
  };

  const features = [
    {
      title: t("landing.features.safeSecure", "Safe & Secure"),
      description: t("landing.features.safeSecureDesc", "Every local is verified, with safety features built into every booking."),
    },
    {
      title: t("landing.features.flexibleBooking", "Flexible Booking"),
      description: t("landing.features.flexibleBookingDesc", "Skip the back-and-forth and book with confidence."),
    },
    {
      title: t("landing.features.authenticExperiences", "Authentic Experiences"),
      description: t("landing.features.authenticExperiencesDesc", "Experience the city beyond the guidebooks."),
    },
    {
      title: t("landing.features.expertGuides", "Expert Guides"),
      description: t("landing.features.expertGuidesDesc", "Verified locals with deep knowledge of the city."),
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
      title: t("landing.howTraveler.step2", "Explore Guide profiles and experiences"),
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
      initials: "DT",
      quote: t(
        "landing.team.design",
        "Good design should feel invisible. We simplify every interaction so you can focus on exploring, not figuring out how the app works."
      ),
    },
    {
      name: t("landing.team.engineeringName", "Engineering Team"),
      initials: "ET",
      quote: t(
        "landing.team.engineering",
        "We build a platform that's fast, reliable, and secure—so you can travel with confidence."
      ),
    },
    {
      name: t("landing.team.researchName", "Research Team"),
      initials: "RT",
      quote: t(
        "landing.team.research",
        "We listen first. Every feature is shaped by real traveler and local guide insights."
      ),
    },
  ];

  const faqs = [
    {
      question: t("landing.faq.q1", "What is Ahhh Yaotu?"),
      answer: t("landing.faq.a1", "Ahhh Yaotu is building a Japan-focused marketplace that connects travelers with verified local guides for personal, flexible experiences."),
    },
    {
      question: t("landing.faq.q2", "How are local guides verified?"),
      answer: t("landing.faq.a2", "Every guide goes through a review and verification process designed to make safety and trust part of every experience."),
    },
    {
      question: t("landing.faq.q3", "How do I get early access?"),
      answer: t("landing.faq.a3", "Join the traveler waitlist with your name and email. We’ll prioritize inviting confirmed travelers when the first guide experiences are ready."),
    },
    {
      question: t("landing.faq.q4", "How can I become a local guide?"),
      answer: t("landing.faq.a4", "Start an application and share your local knowledge, service preferences, and availability with the Yaotu team."),
    },
  ];

  return (
    <div className="yaotu-landing min-h-screen overflow-x-clip bg-white text-[#020817]">
      <div className="hero-fixed-orb" aria-hidden />
      <ScrollToTopButton />

      <section id="hero-section" className="relative isolate flex h-screen h-[100svh] flex-col overflow-hidden px-5 pb-16 pt-6 sm:px-8 lg:px-12">
        <div className="relative z-20 mx-auto flex w-full max-w-[94rem] items-center justify-between">
          <h1 className="yaotu-wordmark" aria-label="YaoTu">
            <img src="/yaotu-logo.png" alt="YaoTu" className="yaotu-logo-image" />
          </h1>
          <LanguageSwitcher />
        </div>

        <div className="absolute inset-0 z-[1] hidden md:block" aria-hidden>
          <CursorFollow
            images={heroImages}
            containerSelector="#hero-section"
            fadeSelector="[data-hero-copy]"
            cycleMode="sequential"
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[94rem] flex-1 flex-col items-center justify-center text-center">
          <div className="hero-orbit" aria-hidden>
            <span className="hero-satellite hero-satellite-a" />
            <span className="hero-satellite hero-satellite-b" />
          </div>
          <div className="hero-static-gallery" aria-hidden>
            <figure className="hero-photo hero-photo-a"><img src="/hero-scene-bamboo.png" alt="" /></figure>
            <figure className="hero-photo hero-photo-b"><img src="/hero-scene-torii.png" alt="" /></figure>
            <figure className="hero-photo hero-photo-c"><img src="/hero-scene-kyoto.png" alt="" /></figure>
            <figure className="hero-photo hero-photo-d"><img src="/hero-scene-coast.png" alt="" /></figure>
          </div>
          <div className="relative z-20 max-w-4xl" data-hero-copy>
            <p className="hero-display">
              <span className="hero-display-affix">www.</span>
              <span className="hero-display-ahhh">ahhh</span>
              <span className="hero-display-hyphen">-</span>
              <span className="hero-display-yaotu">yaotu</span>
              <span className="hero-display-affix">.com</span>
            </p>
            <p className="hero-tagline mx-auto mt-4 max-w-xl text-balance">
              {t(
                "landing.hero.tagline",
                "Apply to become one of our first local Guides in Japan, or register for Traveler Early Access."
              )}
            </p>
            <div className="pointer-events-auto mt-6 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="yaotu-button min-h-12 w-full px-6 sm:w-auto"
                onClick={handleBecomeGuide}
              >
                {t("landing.hero.guideCta", "Become a Local Guide")}
              </button>
              <button
                type="button"
                className="yaotu-secondary-button min-h-12 w-full px-6 sm:w-auto"
                onClick={handleTravelerWaitlist}
              >
                {t("landing.hero.waitlistCta", "Get Traveler Early Access")}
              </button>
            </div>
          </div>
          <p className="hero-explore-cue absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a725f] md:block">Scroll to explore</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <section className="section-shell bg-white" aria-labelledby="why-title">
          <div className="section-heading-row">
            <h2 id="why-title">{t("landing.features.title", "Why Choose YaoTu?")}</h2>
            <p>{t("landing.features.subtitle", "Explore the city with locals who know it best.")}</p>
          </div>
          <div className="feature-grid mt-12">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                className="feature-card"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -80px 0px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="feature-icon">{featureIcons[index]}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="relative overflow-x-clip bg-white" aria-labelledby="how-title">
          <div className="section-shell pb-4 pt-6 sm:pb-6">
            <div className="section-heading-row">
              <h2 id="how-title">{t("landing.howTraveler.sectionTitle", "How Yaotu works")}</h2>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
            <FlowStoryRow
              primary
              title={t("landing.howGuide.title", "Become a local Guide with Yaotu")}
              status={t("landing.howGuide.eyebrow", "Applications open")}
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
              title={t("landing.howGuideOperations.title", "Start hosting with Yaotu")}
              status={t("landing.howGuideOperations.eyebrow", "After approval")}
              description={t(
                "landing.howGuideOperations.subtitle",
                "Once approved, create and publish your local experiences, manage Traveler bookings, and track your earnings and payouts directly through Yaotu."
              )}
              steps={guideOperationsSteps}
              activeStep={guideOperationsActiveStep}
              onStepChange={setGuideOperationsActiveStep}
              label={t("landing.howGuideOperations.title", "Start hosting with Yaotu")}
              ctaLabel={t("landing.howGuide.cta", "Become a Local Guide")}
              onCtaClick={handleBecomeGuide}
            />
            <FlowStoryRow
              title={t("landing.howTraveler.title", "Preview the Traveler experience")}
              status={t("landing.howTraveler.eyebrow", "Coming Soon")}
              description={t(
                "landing.howTraveler.subtitle",
                "The Traveler marketplace is coming soon. You'll be able to discover local Guides in Japan, explore their profiles and experiences, and book directly through Yaotu. Register for Early Access now."
              )}
              steps={travelerSteps}
              activeStep={travelerActiveStep}
              onStepChange={setTravelerActiveStep}
              label={t("landing.howTraveler.title", "Preview the Traveler experience")}
              ctaLabel={t("landing.howTraveler.cta", "Get Traveler Early Access")}
              onCtaClick={handleTravelerWaitlist}
            />
          </div>
        </section>

        <section className="section-shell team-intro-section bg-white" aria-labelledby="team-title">
          <div className="section-heading-row">
            <h2 id="team-title">{t("landing.team.title", "From Our Team")}</h2>
            <p>{t("landing.team.subtitle", "Built by people who care about better travel experiences.")}</p>
          </div>
          <div className="team-grid mt-12">
            {team.map((member) => (
              <Card key={member.name} className="team-card border-0">
                <CardContent className="team-card-content p-7 sm:p-8">
                  <span className="team-quote-mark" aria-hidden>“</span>
                  <p className="team-quote">{member.quote}</p>
                  <div className="team-profile">
                    <div className="team-avatar" aria-hidden>{member.initials}</div>
                    <p className="team-author">{member.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <TeamMemberMarquee
          title={t("landing.teamMembers.title", "Meet the team")}
          featuredSubtitle={t(
            "landing.teamMembers.featuredSubtitle",
            "The people building Yaotu."
          )}
          featured={featuredTeamMembers}
          rows={teamMemberRows}
          closeLabel={t("common.close", "Close")}
          connectLabel={t("landing.teamMembers.connect", "Connect")}
          linkedInLabel={t("landing.teamMembers.linkedIn", "LinkedIn")}
          portfolioLabel={t("landing.teamMembers.portfolio", "Portfolio")}
          contactLabel={t("landing.teamMembers.contact", "Contact")}
          formerLabel={t("landing.teamMembers.former", "Former")}
        />

        <section className="section-shell" aria-labelledby="faq-title">
          <div className="faq-layout">
            <div>
              <h2 id="faq-title">FAQ</h2>
              <p className="mt-4 leading-7 text-[#625f55]">Everything you need to know.</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.question} className={`faq-card ${isOpen ? "is-open" : ""}`}>
                    <button type="button" className="faq-trigger font-bold" aria-expanded={isOpen} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(isOpen ? null : index)}>
                      <span>{faq.question}</span>
                      <span className="faq-toggle" aria-hidden>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </span>
                    </button>
                    <div id={`faq-answer-${index}`} className={`faq-answer ${isOpen ? "is-open" : ""}`}>
                      <p className="w-full leading-7 text-[#625f55]">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="become-guide-cta" className="final-cta" aria-labelledby="final-cta-title">
          <div className="relative z-10 mx-auto flex max-w-[82rem] flex-col items-start px-5 py-20 text-left sm:px-8 sm:py-24 lg:px-12">
            <Globe2 className="h-8 w-8 text-white" aria-hidden />
            <h2 id="final-cta-title" className="mt-8">
              {t("landing.cta.title", "Ready to help shape travel in Japan?")}
            </h2>
            <p className="final-cta-subtitle">
              {t(
                "landing.cta.subtitle",
                "Apply as a local Guide and help build Yaotu's first Japan experience network."
              )}
            </p>
            <Button className="final-cta-button mt-9 min-h-12 px-6" onClick={handleBecomeGuide}>
              {t("landing.cta.becomeGuide", "Apply to Become a Local Guide")}{" "}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
            <p className="final-cta-status mt-6">
              <span>{t("landing.cta.viewApplicationStatusPrefix", "Already Applied?")}</span>{" "}
              <button
                type="button"
                className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-white"
                onClick={handleViewApplicationStatus}
              >
                {t(
                  "landing.cta.viewApplicationStatusAction",
                  "View Your Application Status"
                )}
              </button>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
