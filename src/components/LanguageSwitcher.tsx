import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage, SUPPORTED_LOCALES, SupportedLocale } from '@/i18n/LanguageProvider';
import { cn } from '@/lib/utils';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !isOpen) return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLanguageChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "flex h-9 items-center justify-center gap-1.5 rounded-[10px] bg-white/95 px-3 text-sm font-medium text-[#171714] shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
          "transition-colors duration-150 hover:bg-[#f3f4f6]",
          isOpen && "bg-[#f3f4f6]"
        )}
        aria-label="Switch language"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-haspopup="menu"
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">{SUPPORTED_LOCALES[locale]}</span>
        <ChevronDown className={cn(
          "h-3.5 w-3.5 transition-transform duration-200",
          isOpen && "rotate-180"
        )} aria-hidden />
      </button>

      {isOpen && (
        <div
          id={menuId}
          className="absolute right-0 z-50 mt-1.5 w-36 overflow-hidden rounded-[10px] border border-[#d6cfb7] bg-white shadow-[0_10px_28px_rgba(2,8,23,0.14)]"
          role="menu"
          aria-orientation="vertical"
        >
          {Object.entries(SUPPORTED_LOCALES).map(([code, name]) => (
            <button
              key={code}
              type="button"
              onClick={() => handleLanguageChange(code as SupportedLocale)}
              className={cn(
                "flex min-h-9 w-full items-center px-3 text-left text-sm text-[#374151] transition-colors duration-150",
                locale === code
                  ? "bg-[#f3f4f6] text-[#171714]"
                  : "bg-white hover:bg-[#f8f7f2] hover:text-[#171714]"
              )}
              role="menuitemradio"
              aria-checked={locale === code}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
