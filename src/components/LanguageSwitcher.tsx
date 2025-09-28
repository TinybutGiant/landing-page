import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage, SUPPORTED_LOCALES, SupportedLocale } from '@/i18n/LanguageProvider';
import { cn } from '@/lib/utils';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300",
          "hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
          "rounded-md transition-colors duration-200"
        )}
        aria-label="Switch language"
      >
        <Globe className="h-4 w-4" />
        <span>{SUPPORTED_LOCALES[locale]}</span>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {Object.entries(SUPPORTED_LOCALES).map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code as SupportedLocale)}
                className={cn(
                  "block w-full text-left px-4 py-2 text-sm",
                  locale === code
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
                role="menuitem"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
