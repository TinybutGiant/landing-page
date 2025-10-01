/**
 * 货币转换工具函数
 * 用于处理用户界面（元）和数据库存储（分）之间的转换
 */

/**
 * 将元转换为分（用于存储到数据库）
 * @param yuan 元金额
 * @returns 分金额
 */
export const convertYuanToCents = (yuan: number): number => {
  return Math.round(yuan * 100);
};

/**
 * 将分转换为元（用于从数据库读取并显示）
 * @param cents 分金额
 * @returns 元金额
 */
export const convertCentsToYuan = (cents: number): number => {
  return cents / 100;
};

/**
 * 格式化货币显示
 * @param amount 金额（元）
 * @param currency 货币代码
 * @returns 格式化后的货币字符串
 */
export const formatCurrency = (amount: number, currency: string = 'JPY'): string => {
  const currencySymbols: Record<string, string> = {
    'CNY': '¥',
    'JPY': '¥',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'KRW': '₩',
    'THB': '฿',
    'SGD': 'S$',
    'HKD': 'HK$',
    'TWD': 'NT$',
    'AUD': 'A$',
    'CAD': 'C$',
    'NZD': 'NZ$'
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
};

/**
 * 处理表单数据中的价格转换（元转分）
 * @param formData 表单数据
 * @returns 转换后的数据
 */
export const processFormDataForDatabase = (formData: any) => {
  return {
    ...formData,
    basicPricePerHourCents: formData.basicPricePerHour !== undefined 
      ? convertYuanToCents(formData.basicPricePerHour) 
      : undefined,
    additionalPricePerPersonCents: formData.additionalPricePerPerson !== undefined 
      ? convertYuanToCents(formData.additionalPricePerPerson) 
      : undefined,
  };
};

/**
 * 处理从数据库读取的数据（分转元）
 * @param dbData 数据库数据
 * @returns 转换后的数据
 */
export const processDatabaseDataForForm = (dbData: any) => {
  return {
    ...dbData,
    basicPricePerHour: dbData.basicPricePerHourCents !== undefined 
      ? convertCentsToYuan(dbData.basicPricePerHourCents) 
      : undefined,
    additionalPricePerPerson: dbData.additionalPricePerPersonCents !== undefined 
      ? convertCentsToYuan(dbData.additionalPricePerPersonCents) 
      : undefined,
  };
};
