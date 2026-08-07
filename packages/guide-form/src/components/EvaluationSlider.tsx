import type { MouseEvent } from 'react';

export interface EvaluationSliderUI {
  Slider: any;
  Tooltip?: any;
  TooltipContent?: any;
  TooltipProvider?: any;
  TooltipTrigger?: any;
  Info?: any;
}

interface EvaluationSliderProps {
  title: string;
  tooltip: string;
  instruction: string;
  unselectedLabel: string;
  rangeStart: string;
  rangeEnd: string;
  value?: number | null;
  onChange: (value: number) => void;
  ui: EvaluationSliderUI;
}

const valueFromPointer = (event: MouseEvent<HTMLButtonElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  return Math.round(ratio * 8) + 1;
};

export const EvaluationSlider = ({
  title,
  tooltip,
  instruction,
  unselectedLabel,
  rangeStart,
  rangeEnd,
  value,
  onChange,
  ui,
}: EvaluationSliderProps) => {
  const {
    Slider,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    Info,
  } = ui;
  const hasValue = typeof value === 'number';
  const position = hasValue ? Math.min(97, Math.max(3, ((value - 1) / 8) * 100)) : 50;
  const tooltipEnabled =
    Tooltip && TooltipContent && TooltipProvider && TooltipTrigger && Info;

  const infoButton = tooltipEnabled ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="text-gray-400 transition-colors hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={tooltip}
          >
            <Info className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm leading-relaxed">
          <p>{tooltip}</p>
          <p className="mt-1 text-xs opacity-80">{instruction}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : null;

  return (
    <div className="border-t border-gray-200 pt-5 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</p>
        {infoButton}
      </div>

      <div className="mt-5">
        <div className="relative mb-2 h-5" aria-live="polite">
          {hasValue ? (
            <span
              className="absolute -translate-x-1/2 rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground"
              style={{ left: `${position}%` }}
            >
              {value}
            </span>
          ) : (
            <span className="absolute left-1/2 -translate-x-1/2 text-xs text-gray-400">
              {unselectedLabel}
            </span>
          )}
        </div>

        {hasValue ? (
          <Slider
            min={1}
            max={9}
            step={1}
            value={[value]}
            onValueChange={([nextValue]: number[]) => onChange(nextValue)}
            aria-label={title}
          />
        ) : (
          <button
            type="button"
            className="relative flex h-7 w-full cursor-pointer items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={(event) => onChange(event.detail === 0 ? 5 : valueFromPointer(event))}
            aria-label={`${title}: ${unselectedLabel}`}
          >
            <span className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
          </button>
        )}

        <div className="mt-2 grid grid-cols-2 gap-4 text-xs leading-5 text-gray-500 dark:text-gray-300">
          <p className="text-left">{rangeStart}</p>
          <p className="text-right">{rangeEnd}</p>
        </div>
      </div>
    </div>
  );
};
