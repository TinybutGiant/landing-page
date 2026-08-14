export const convertYuanToCents = (amount: number): number => Math.round(amount * 100);

export const convertCentsToYuan = (cents: number): number => cents / 100;

export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  const currencySymbols: Record<string, string> = {
    CNY: "CNY ",
    JPY: "JPY ",
    USD: "$",
    EUR: "EUR ",
    GBP: "GBP ",
    KRW: "KRW ",
    THB: "THB ",
    SGD: "S$",
    HKD: "HK$",
    TWD: "NT$",
    AUD: "A$",
    CAD: "C$",
    NZD: "NZ$",
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
};

export const processFormDataForDatabase = (formData: any) => ({
  ...formData,
  currency: "USD",
  basicPricePerHourCents:
    formData.basicPricePerHour !== undefined ? convertYuanToCents(formData.basicPricePerHour) : undefined,
  additionalPricePerPersonCents:
    formData.additionalPricePerPerson !== undefined
      ? convertYuanToCents(formData.additionalPricePerPerson)
      : undefined,
});

export const processDatabaseDataForForm = (dbData: any) => ({
  ...dbData,
  currency: "USD",
  basicPricePerHour:
    dbData.basicPricePerHourCents !== undefined && dbData.basicPricePerHourCents !== null
      ? convertCentsToYuan(dbData.basicPricePerHourCents)
      : dbData.basicPricePerHour,
  additionalPricePerPerson:
    dbData.additionalPricePerPersonCents !== undefined &&
    dbData.additionalPricePerPersonCents !== null
      ? convertCentsToYuan(dbData.additionalPricePerPersonCents)
      : dbData.additionalPricePerPerson,
});
