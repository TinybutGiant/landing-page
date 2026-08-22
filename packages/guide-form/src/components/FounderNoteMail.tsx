import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mail, X } from "lucide-react";
import { useIntl } from "react-intl";

const FOUNDER_NOTE_PARAGRAPH_IDS = [
  "guideForm.founderNote.body1",
  "guideForm.founderNote.body2",
  "guideForm.founderNote.body3",
  "guideForm.founderNote.body4",
  "guideForm.founderNote.body5",
  "guideForm.founderNote.body6",
  "guideForm.founderNote.body7",
  "guideForm.founderNote.body8",
  "guideForm.founderNote.body9",
  "guideForm.founderNote.body10",
  "guideForm.founderNote.body11",
  "guideForm.founderNote.body12",
  "guideForm.founderNote.body13",
  "guideForm.founderNote.body14",
  "guideForm.founderNote.body15",
  "guideForm.founderNote.body16",
] as const;

const FOUNDER_NOTE_DIALOG_ID = "become-guide-founder-note-dialog";
const FOUNDER_NOTE_TITLE_ID = "become-guide-founder-note-title";
export const FOUNDER_NOTE_READ_STORAGE_KEY = "yaotu_founder_note_read";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const readFounderNoteReadState = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(FOUNDER_NOTE_READ_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const persistFounderNoteReadState = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FOUNDER_NOTE_READ_STORAGE_KEY, "true");
  } catch {
    // localStorage can be unavailable in privacy modes; the in-memory read state still applies.
  }
};

const useIsDesktopViewport = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined" || typeof window.matchMedia !== "function"
      ? true
      : window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = () => setIsDesktop(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDesktop;
};

const FounderNoteContent = () => {
  const intl = useIntl();

  return (
    <article aria-labelledby={FOUNDER_NOTE_TITLE_ID} className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300">
          {intl.formatMessage({ id: "guideForm.founderNote.eyebrow" })}
        </p>
        <h2
          id={FOUNDER_NOTE_TITLE_ID}
          className="text-2xl font-semibold text-gray-950 dark:text-white"
        >
          {intl.formatMessage({ id: "guideForm.founderNote.title" })}
        </h2>
      </div>
      <div className="space-y-4 text-base leading-7 text-gray-700 dark:text-gray-200">
        {FOUNDER_NOTE_PARAGRAPH_IDS.map((id) => (
          <p key={id}>
            {intl.formatMessage(
              { id },
              {
                strong: (chunks: ReactNode) => (
                  <strong className="font-semibold text-gray-950 dark:text-white">
                    {chunks}
                  </strong>
                ),
              }
            )}
          </p>
        ))}
      </div>
    </article>
  );
};

export const FounderNoteMail = () => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [hasReadFounderNote, setHasReadFounderNote] = useState(readFounderNoteReadState);
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktopViewport();
  const desktopTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const launcherLabel = intl.formatMessage({
    id: hasReadFounderNote
      ? "guideForm.founderNote.trigger.read"
      : "guideForm.founderNote.trigger.unread",
  });
  const closeLabel = intl.formatMessage({ id: "guideForm.founderNote.closeLabel" });

  const close = useCallback(() => setIsOpen(false), []);
  const openFrom = useCallback((trigger: HTMLButtonElement | null) => {
    lastTriggerRef.current = trigger;
    setHasReadFounderNote(true);
    persistFounderNoteReadState();
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      lastTriggerRef.current?.focus({ preventScroll: true });
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => element.offsetParent !== null
      );
      if (focusable.length === 0) {
        event.preventDefault();
        closeButtonRef.current?.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, isOpen]);

  const panelInitial = reduceMotion
    ? { opacity: 1, x: 0, y: 0 }
    : isDesktop
      ? { opacity: 0, x: 56, y: 0 }
      : { opacity: 0, x: 0, y: 72 };
  const panelExit = reduceMotion
    ? { opacity: 1, x: 0, y: 0 }
    : isDesktop
      ? { opacity: 0, x: 56, y: 0 }
      : { opacity: 0, x: 0, y: 72 };
  const iconAnimation = reduceMotion ? undefined : { rotate: [0, -8, 6, 0], y: [0, -2, 0, 0] };

  return (
    <>
      <motion.button
        ref={desktopTriggerRef}
        type="button"
        aria-label={launcherLabel}
        aria-controls={FOUNDER_NOTE_DIALOG_ID}
        aria-expanded={isOpen}
        onClick={() => openFrom(desktopTriggerRef.current)}
        className="fixed right-0 top-[45vh] z-40 hidden -translate-y-1/2 items-center gap-2 rounded-l-full border border-r-0 border-yellow-300 bg-white px-4 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-yellow-900/10 transition-colors hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:border-yellow-500/50 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 md:flex"
        initial={reduceMotion ? false : { opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={reduceMotion ? undefined : { delay: 0.55, duration: 0.35, ease: "easeOut" }}
      >
        <motion.span
          aria-hidden="true"
          animate={iconAnimation}
          transition={reduceMotion ? undefined : { delay: 0.95, duration: 0.6, ease: "easeOut" }}
        >
          <Mail className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
        </motion.span>
        <span>{launcherLabel}</span>
      </motion.button>

      <motion.button
        ref={mobileTriggerRef}
        type="button"
        aria-label={launcherLabel}
        aria-controls={FOUNDER_NOTE_DIALOG_ID}
        aria-expanded={isOpen}
        onClick={() => openFrom(mobileTriggerRef.current)}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-yellow-300 bg-white text-yellow-700 shadow-lg shadow-yellow-900/15 transition-colors hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:border-yellow-500/50 dark:bg-gray-900 dark:text-yellow-300 md:hidden"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={reduceMotion ? undefined : { delay: 0.55, duration: 0.35, ease: "easeOut" }}
      >
        <motion.span
          aria-hidden="true"
          animate={iconAnimation}
          transition={reduceMotion ? undefined : { delay: 0.95, duration: 0.6, ease: "easeOut" }}
        >
          <Mail className="h-5 w-5" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/[0.04] backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              onClick={close}
            />
            <motion.aside
              id={FOUNDER_NOTE_DIALOG_ID}
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={FOUNDER_NOTE_TITLE_ID}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[78dvh] overflow-hidden rounded-t-2xl border border-yellow-200 bg-white shadow-2xl shadow-yellow-950/20 dark:border-yellow-500/30 dark:bg-gray-900 md:inset-x-auto md:bottom-auto md:right-0 md:top-0 md:h-[100dvh] md:max-h-none md:w-[min(430px,calc(100vw-2rem))] md:rounded-none md:rounded-l-2xl md:border-y-0 md:border-r-0"
              initial={panelInitial}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={panelExit}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 360, damping: 34, mass: 0.8 }
              }
            >
              <div className="flex max-h-[78dvh] flex-col md:h-full md:max-h-none">
                <div className="border-b border-yellow-100 px-5 pb-4 pt-3 dark:border-yellow-500/20 sm:px-6 md:px-7 md:pt-6">
                  <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-yellow-200 dark:bg-yellow-500/40 md:hidden" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300">
                        <Mail className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-semibold text-gray-950 dark:text-white">
                        {launcherLabel}
                      </p>
                    </div>
                    <button
                      ref={closeButtonRef}
                      type="button"
                      aria-label={closeLabel}
                      onClick={close}
                      className="rounded-full p-2 text-gray-500 transition-colors hover:bg-yellow-50 hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto px-5 py-6 sm:px-6 md:px-7">
                  <FounderNoteContent />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
