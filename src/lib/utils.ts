import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 简单的时间格式化函数
export function formatTime(timeString: string): string {
  if (!timeString) return "Not selected";
  
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    const hour = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  } catch {
    return timeString; // 如果解析失败，返回原始字符串
  }
}
