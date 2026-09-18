import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type HowYaotuStep = {
  title: string;
  image: string;
  description: string;
};

type StepFlowProps = {
  steps: HowYaotuStep[];
  label: string;
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  title: string;
  status?: string;
  description: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  primary?: boolean;
  imageFirstOnDesktop?: boolean;
};

const StepFlow = ({
  steps,
  label,
  activeIndex,
  onActiveChange,
  title,
  status,
  description,
  ctaLabel,
  onCtaClick,
  primary = false,
  imageFirstOnDesktop = false,
}: StepFlowProps) => {
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
  const renderCta = (className = "") =>
    ctaLabel && onCtaClick ? (
      primary ? (
        <Button className={`yaotu-button min-h-12 px-6 ${className}`} onClick={onCtaClick}>
          {ctaLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <button type="button" className={`yaotu-secondary-button min-h-12 px-6 ${className}`} onClick={onCtaClick}>
          {ctaLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      )
    ) : null;

  return (
    <div className="w-full">
      <div className="px-1 sm:px-4 lg:px-6">
        <div
          className={`grid items-stretch gap-6 p-1 sm:gap-8 sm:p-2 lg:min-h-[30rem] lg:gap-10 lg:p-3 ${
            imageFirstOnDesktop
              ? "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:[grid-template-areas:'media_copy']"
              : "lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:[grid-template-areas:'copy_media']"
          }`}
        >
          <div className="order-1 flex min-w-0 flex-col text-left lg:[grid-area:copy]">
            {status ? (
              <span
                className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                  primary
                    ? "bg-[#facc14]/20 text-[#171714]"
                    : "border border-[#facc14] bg-white text-[#49463e]"
                }`}
              >
                {status}
              </span>
            ) : null}

            <h3 className="mt-4 max-w-xl text-balance text-2xl font-bold leading-snug tracking-[-0.03em] text-[#020817] sm:text-3xl lg:text-4xl lg:leading-[1.15]">
              {title}
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#625f55] sm:text-base">
              {description}
            </p>

            <div className="my-6 h-px w-full max-w-xl bg-[#d6cfb7]/70" aria-hidden />

            <div className="mb-4 flex items-center gap-2.5">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`${label}: step ${index + 1}`}
                  aria-current={index === active ? "step" : undefined}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    index === active
                      ? "bg-[#facc14] text-[#171714]"
                      : "bg-[#eee8d4] text-[#7a725f] hover:bg-[#e2d9b9] hover:text-[#171714]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="grid max-w-xl">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  aria-hidden={index !== active}
                  initial={false}
                  animate={{
                    opacity: index === active ? 1 : 0,
                    x: index === active ? 0 : index < active ? -20 : 20,
                  }}
                  transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                  className="col-start-1 row-start-1"
                  style={{ pointerEvents: index === active ? "auto" : "none" }}
                >
                  <h4 className="text-xl font-bold leading-snug tracking-[-0.02em] text-[#171714] sm:text-2xl">
                    {step.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#49463e] sm:text-base">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {ctaLabel && onCtaClick ? (
              <div className="mt-auto hidden pt-8 lg:block">{renderCta()}</div>
            ) : null}
          </div>

          <div className="order-2 w-full min-w-0 self-start lg:[grid-area:media]">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-[#fffaf0]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.title}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -20 }}
                  transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                  className="h-full w-full"
                >
                  <img
                    src={current.image}
                    alt={current.title}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {ctaLabel && onCtaClick ? (
            <div className="order-3 lg:hidden">{renderCta("w-full justify-center")}</div>
          ) : null}
        </div>

        <div className="mt-8 grid h-10 grid-cols-[2.5rem_auto_2.5rem] items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={!canGoPrev}
            aria-label={`${label}: previous step`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171714] text-white transition-opacity hover:bg-[#2a2a26] disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2.5">
            {steps.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`${label}: step ${index + 1}`}
                aria-current={index === active}
                className={`h-2.5 rounded-full transition-all ${
                  index === active ? "w-7 bg-[#facc14]" : "w-2.5 bg-[#d9d1b4] hover:bg-[#c4bb9a]"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={!canGoNext}
            aria-label={`${label}: next step`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#facc14] text-[#171714] transition-opacity hover:bg-[#e3b80d] disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

type FlowStoryRowProps = {
  title: string;
  status?: string;
  description: string;
  steps: HowYaotuStep[];
  activeStep: number;
  onStepChange: (index: number) => void;
  label: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  primary?: boolean;
  tone?: "white" | "warm";
  imageFirstOnDesktop?: boolean;
};

export const FlowStoryRow = ({
  title,
  status,
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
}: FlowStoryRowProps) => {
  return (
    <div className="relative py-10 sm:py-12 lg:py-16">
      {tone === "warm" ? (
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-[#fffaf0]"
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
          status={status}
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
