import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { createIntl } from '@formatjs/intl';

// Import language files
import enMessages from './locales/en.json';
import zhCNMessages from './locales/zh-CN.json';

// Define supported locales
export const SUPPORTED_LOCALES = {
  'en': 'English',
  'zh-CN': '中文'
} as const;

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES;

// Language context
interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  messages: Record<string, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Function to flatten nested messages
const flattenMessages = (nestedMessages: any, prefix = ''): Record<string, string> => {
  const flattenedMessages: Record<string, string> = {};
  
  for (const key in nestedMessages) {
    if (nestedMessages.hasOwnProperty(key)) {
      const value = nestedMessages[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        flattenedMessages[newKey] = value;
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(flattenedMessages, flattenMessages(value, newKey));
      }
    }
  }
  
  return flattenedMessages;
};

// Messages mapping with flattened structure
const messages: Record<SupportedLocale, Record<string, string>> = {
  'en': flattenMessages(enMessages),
  'zh-CN': flattenMessages(zhCNMessages),
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial locale from localStorage or default to 'en'
  const getInitialLocale = (): SupportedLocale => {
    const savedLocale = localStorage.getItem('locale') as SupportedLocale;
    if (savedLocale && savedLocale in SUPPORTED_LOCALES) {
      return savedLocale;
    }
    
    // Try to detect browser language
    const browserLang = navigator.language;
    if (browserLang.startsWith('zh')) {
      return 'zh-CN';
    }
    
    return 'en';
  };

  const [locale, setLocaleState] = useState<SupportedLocale>(getInitialLocale);

  // Update locale and save to localStorage
  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Update document direction and language
    document.documentElement.dir = 'ltr'; // We only support LTR languages
    document.documentElement.lang = newLocale;
  };

  // Set initial document attributes
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = 'ltr'; // We only support LTR languages
  }, [locale]);

  const contextValue: LanguageContextType = {
    locale,
    setLocale,
    messages: messages[locale],
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        defaultLocale="en"
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

// Utility function to format messages outside of React components
export const formatMessage = (
  locale: SupportedLocale,
  id: string,
  defaultMessage?: string,
  values?: Record<string, any>
): string => {
  const intl = createIntl({
    locale,
    messages: messages[locale],
    defaultLocale: 'en',
  });

  return intl.formatMessage(
    { id, defaultMessage },
    values
  ) as string;
};
