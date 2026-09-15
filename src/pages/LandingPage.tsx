import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  Compass,
  Globe2,
  MapPin,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import CursorFollow from "@/components/CursorFollow";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import TeamMemberMarquee from "@/components/TeamMemberMarquee";
import { featuredTeamMembers, teamMemberRows } from "@/data/teamMembers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/i18n/LanguageProvider";

type JourneyMode = "traveler" | "guide";

type JourneyStep = {
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

const WaitlistModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => nameRef.current?.focus(), 80);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setSubmitted(false);
  }, [open]);

  useEffect(() => {
    if (submitted) window.setTimeout(() => doneRef.current?.focus(), 60);
  }, [submitted]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    window.localStorage.setItem(
      "yaotuWaitlistSubmission",
      JSON.stringify({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        submittedAt: new Date().toISOString(),
      })
    );
    setSubmitted(true);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="waitlist-overlay fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Close waitlist form"
            className="waitlist-backdrop absolute inset-0"
            onClick={onClose}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-title"
            className="waitlist-dialog relative w-full max-w-lg p-6 sm:p-9"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="waitlist-close absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
            {submitted ? (
              <div className="waitlist-success py-8 text-center" aria-live="polite">
                <div className="waitlist-mark mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                  <Sparkles className="h-5 w-5" aria-hidden />
                </div>
                <h2 id="waitlist-title" className="mt-6 text-3xl font-bold tracking-[-0.03em]">
                  Details saved.
                </h2>
                <p className="mx-auto mt-3 max-w-sm leading-7 text-[#625f55]">
                  This preview saves your details in this browser only. Connect the production waitlist endpoint before launch to enroll visitors.
                </p>
                <Button ref={doneRef} className="yaotu-button waitlist-primary-button mt-7" onClick={onClose}>Done</Button>
              </div>
            ) : (
              <>
                <div className="waitlist-intro text-center">
                  <div className="waitlist-mark mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                    <Compass className="h-5 w-5" aria-hidden />
                  </div>
                  <h2 id="waitlist-title" className="mx-auto mt-6 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                    Explore with a local.
                  </h2>
                  <p className="mx-auto mt-3 max-w-md leading-7 text-[#625f55]">
                    Join the waitlist and be first to hear when guide booking opens.
                  </p>
                </div>
                <form className="waitlist-form mt-7 space-y-5" onSubmit={submit}>
                  <div className="space-y-2">
                    <Label htmlFor="waitlist-name">Name</Label>
                    <Input ref={nameRef} id="waitlist-name" name="name" autoComplete="name" required className="h-12 rounded-[10px] border-[#cbc5b3] bg-white focus-visible:ring-[#c99800]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waitlist-email">Email</Label>
                    <Input id="waitlist-email" name="email" type="email" autoComplete="email" required className="h-12 rounded-[10px] border-[#cbc5b3] bg-white focus-visible:ring-[#c99800]" />
                  </div>
                  <Button type="submit" className="yaotu-button waitlist-primary-button h-12 w-full">Join the Waitlist</Button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const LandingPage = () => {
  const { messages } = useLanguage();
  const t = (key: string, fallback: string) => messages[key] || fallback;
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [journeyMode, setJourneyMode] = useState<JourneyMode>("traveler");

  const triggerWaitlistOnHowHover = () => {
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsHover || waitlistOpen || window.sessionStorage.getItem("yaotuHowModalShown")) return;
    window.sessionStorage.setItem("yaotuHowModalShown", "true");
    setWaitlistOpen(true);
  };

  const scrollToGuide = () => {
    document.getElementById("become-guide-cta")?.scrollIntoView({ behavior: "smooth", block: "center" });
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

  const journeys: Record<JourneyMode, JourneyStep[]> = {
    traveler: [
      { title: "Find a Local", image: "/hero-scene-kyoto.png", description: "Discover verified locals who match your interests and travel style." },
      { title: "Book Instantly", image: "/hero-scene-fuji.png", description: "Choose a time that works and confirm your experience with confidence." },
      { title: "Explore Together", image: "/hero-scene-torii.png", description: "Meet your local and experience the city beyond the usual route." },
    ],
    guide: [
      { title: "Open a Slot", image: "/hero-scene-kyoto.png", description: "Share when you’re available and the experiences you know best." },
      { title: "Book Instantly", image: "/hero-scene-fuji.png", description: "Receive confirmed bookings without the back-and-forth." },
      { title: "Explore Together", image: "/hero-scene-torii.png", description: "Welcome curious travelers and show them your city your way." },
    ],
  };

  const team = [
    { name: "Design Team", initials: "DT", quote: "Good design should feel invisible. We simplify every interaction so you can focus on exploring, not figuring out how the app works." },
    { name: "Engineering Team", initials: "ET", quote: "We build a platform that's fast, reliable, and secure—so you can travel with confidence." },
    { name: "Research Team", initials: "RT", quote: "We listen first. Every feature is shaped by real traveler and local guide insights." },
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
            <p className="hero-display" aria-hidden="true">
              <span className="hero-display-ahhh">ahhh</span>{" "}
              <span className="hero-display-yaotu">yaotu</span>
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-8 text-[#49463e] sm:text-xl">
              Connect with verified locals who match your interests, travel style, and schedule.
            </p>
          </div>
          <p className="hero-explore-cue absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a725f] md:block">Move to explore</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <section className="section-shell bg-[#fffaf0]" aria-labelledby="why-title">
          <div className="section-heading-row">
            <h2 id="why-title">Why Choose YaoTu?</h2>
            <p>Explore the city with locals who know it best.</p>
          </div>
          <div className="feature-grid mt-12">
            {features.map((feature, index) => (
              <Card key={feature.title} className={`feature-card feature-card-${index + 1}`}>
                <CardHeader>
                  <div className="feature-icon">{featureIcons[index]}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent><CardDescription>{feature.description}</CardDescription></CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <Button
              className="yaotu-button min-h-12 w-full px-6 sm:w-auto"
              onClick={() => setWaitlistOpen(true)}
            >
              Join the Waitlist to Explore Guides
            </Button>
            <button
              type="button"
              className="yaotu-secondary-button min-h-12 w-full px-6 sm:w-auto"
              onClick={scrollToGuide}
            >
              Become a Local Guide
            </button>
          </div>
        </section>

        <section className="section-shell" aria-labelledby="how-title" onMouseEnter={triggerWaitlistOnHowHover}>
          <div className="section-heading-row">
            <h2 id="how-title">How It Works</h2>
            <p>Book a local experience in just three simple steps.</p>
          </div>
          <div className="mx-auto mt-10 flex w-fit rounded-xl bg-[#f2ecd4] p-1" role="tablist" aria-label="How Yaotu works">
            {(["traveler", "guide"] as JourneyMode[]).map((mode) => (
              <button key={mode} type="button" role="tab" aria-selected={journeyMode === mode} className={`journey-tab ${journeyMode === mode ? "is-active" : ""}`} onClick={() => setJourneyMode(mode)}>
                As {mode === "traveler" ? "Traveler" : "Guide"}
              </button>
            ))}
          </div>
          <div className="journey-flow mt-10">
            {journeys[journeyMode].map((step, index) => (
              <article className="journey-step" key={`${journeyMode}-${step.title}`}>
                <div className="journey-image-wrap"><img src={step.image} alt="" className="journey-image" loading="lazy" /></div>
                <div className="journey-step-copy mt-5">
                  <span className="journey-number" aria-hidden>{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-bold tracking-[-0.02em]">{step.title}</h3>
                    <p className="mt-2 leading-7 text-[#625f55]">{step.description}</p>
                  </div>
                </div>
                {index < journeys[journeyMode].length - 1 && <ArrowRight className="journey-arrow" aria-hidden />}
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell bg-[#fffaf0]" aria-labelledby="team-title">
          <div className="section-heading-row">
            <h2 id="team-title">From Our Team</h2>
            <p>Built by people who care about better travel experiences.</p>
          </div>
          <div className="team-grid mt-12">
            {team.map((member, index) => (
              <Card key={member.name} className={`team-card team-card-${index + 1}`}>
                <CardContent className="team-card-content p-7 sm:p-8">
                  <p className="team-quote text-base font-medium leading-7 text-[#292524]">“{member.quote}”</p>
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
            <h2 id="final-cta-title" className="mt-8 max-w-4xl text-white">Share your expertise and connect with curious travelers</h2>
            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Button className="min-h-12 rounded-[10px] border border-white/70 bg-transparent px-6 font-bold text-white shadow-none hover:bg-white hover:text-[#171714]" onClick={() => { window.location.href = "/become-guide"; }}>
                Become a Local Guide <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
              <p className="max-w-md text-left text-sm leading-6 text-white/80">Bring your local knowledge to travelers looking for a more personal way to explore.</p>
            </div>
          </div>
        </section>
      </main>

      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
};

export default LandingPage;
