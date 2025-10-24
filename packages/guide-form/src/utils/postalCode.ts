/**
 * 邮编格式化和校验工具函数
 * 日本邮编是 7 位数字，通常写成 XXX-XXXX 形式
 */

// 日本邮编正则表达式（纯数字形式）
export const POSTAL_CODE_REGEX = /^\d{7}$/;

/**
 * 清理邮编字符串，只保留数字
 * @param value 用户输入的邮编字符串
 * @returns 清理后的纯数字字符串，最多 7 位
 */
export const sanitizePostalCode = (value: string): string => {
  return value.replace(/\D/g, "").slice(0, 7);
};

/**
 * 格式化邮编为 XXX-XXXX 形式
 * @param value 邮编字符串（可能包含或不包含连字符）
 * @returns 格式化后的邮编字符串（XXX-XXXX）或原始输入（如果长度不足7位）
 */
export const formatPostalCode = (value: string): string => {
  const sanitized = sanitizePostalCode(value);
  if (sanitized.length === 7) {
    return `${sanitized.slice(0, 3)}-${sanitized.slice(3)}`;
  }
  return sanitized;
};

/**
 * 校验邮编是否有效（7 位数字）
 * @param value 邮编字符串
 * @returns 是否有效
 */
export const isValidPostalCode = (value: string): boolean => {
  return POSTAL_CODE_REGEX.test(value);
};

