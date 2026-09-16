import { X } from "lucide-react";
import { useLocation } from "wouter";

import LanguageSwitcher from "@/components/LanguageSwitcher";

type YaotuAppChromeProps = {
  title?: string;
  showLanguage?: boolean;
  showClose?: boolean;
};

const YaotuAppChrome = ({
  title,
  showLanguage = true,
  showClose = true,
}: YaotuAppChromeProps) => {
  const [, setLocation] = useLocation();

  return (
    <header className="become-guide-masthead">
      <div className="mx-auto flex w-full max-w-[82rem] items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => setLocation("/")}
          className="become-guide-brand shrink-0"
          aria-label="YaoTu home"
        >
          <img src="/yaotu-logo.png" alt="YaoTu" />
        </button>
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          {title ? (
            <span className="hidden max-w-[16rem] truncate text-sm font-semibold text-[#625f55] lg:inline">
              {title}
            </span>
          ) : null}
          {showLanguage ? <LanguageSwitcher /> : null}
          {showClose ? (
            <button
              type="button"
              onClick={() => setLocation("/")}
              className="become-guide-close hidden sm:inline-flex"
              aria-label="Back to home"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default YaotuAppChrome;
