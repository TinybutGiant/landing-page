import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearMonthPickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function YearMonthPicker({ value, onChange, placeholder = "请选择年月" }: YearMonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(value ? value.getFullYear().toString() : "");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    value ? (value.getMonth() + 1).toString() : ""
  );

  // 生成年份选项 (从1980年到当前年份)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i);
  
  // 月份选项
  const months = [
    { value: "1", label: "1月" },
    { value: "2", label: "2月" },
    { value: "3", label: "3月" },
    { value: "4", label: "4月" },
    { value: "5", label: "5月" },
    { value: "6", label: "6月" },
    { value: "7", label: "7月" },
    { value: "8", label: "8月" },
    { value: "9", label: "9月" },
    { value: "10", label: "10月" },
    { value: "11", label: "11月" },
    { value: "12", label: "12月" },
  ];

  // 格式化显示文本
  const formatDisplayText = () => {
    if (!value) {
      return placeholder;
    }
    return `${value.getFullYear()}年${value.getMonth() + 1}月`;
  };

  // 处理确认选择
  const handleConfirm = () => {
    if (selectedYear && selectedMonth) {
      const newDate = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1);
      onChange(newDate);
      setIsOpen(false);
    }
  };

  // 处理清除选择
  const handleClear = () => {
    setSelectedYear("");
    setSelectedMonth("");
    onChange(undefined);
    setIsOpen(false);
  };

  // 同步外部value到内部state
  useEffect(() => {
    if (value) {
      setSelectedYear(value.getFullYear().toString());
      setSelectedMonth((value.getMonth() + 1).toString());
    } else {
      setSelectedYear("");
      setSelectedMonth("");
    }
  }, [value]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDisplayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">年份</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="选择年份" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">月份</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="选择月份" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={handleClear}>
              清除
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={!selectedYear || !selectedMonth}
            >
              确认
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

