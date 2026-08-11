import en from './en.json';
import zhCN from './zh-CN.json';

export type GuideFormLocale = 'en' | 'zh-CN' | 'zh';
export type TranslationFunction = (key: string) => string;

const messagesByLocale = {
  en,
  'zh-CN': zhCN,
  zh: zhCN,
} as const;

const getNestedMessage = (messages: object, key: string): string | undefined => {
  let current: unknown = messages;
  for (const segment of key.split('.')) {
    if (!current || typeof current !== 'object' || !(segment in current)) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return typeof current === 'string' ? current : undefined;
};

export const createGuideFormTranslator = (
  locale: GuideFormLocale = 'en'
): TranslationFunction => {
  const messages = messagesByLocale[locale] ?? messagesByLocale.en;
  return (key) => getNestedMessage(messages, key) ?? key;
};

export { en as guideFormEnglishMessages, zhCN as guideFormChineseMessages };
