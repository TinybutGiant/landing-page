import * as React from 'react';

import { cn } from '@/lib/utils';

interface RadioGroupContextValue {
  disabled?: boolean;
  name: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  value?: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  value?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      defaultValue,
      disabled,
      name,
      onValueChange,
      required,
      value,
      ...props
    },
    ref
  ) => {
    const generatedName = React.useId();
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const selectedValue = value === undefined ? internalValue : value;

    const handleValueChange = React.useCallback(
      (nextValue: string) => {
        if (value === undefined) {
          setInternalValue(nextValue);
        }
        onValueChange?.(nextValue);
      },
      [onValueChange, value]
    );

    return (
      <RadioGroupContext.Provider
        value={{
          disabled,
          name: name || generatedName,
          onValueChange: handleValueChange,
          required,
          value: selectedValue,
        }}
      >
        <div
          ref={ref}
          role="radiogroup"
          aria-disabled={disabled || undefined}
          className={cn('grid gap-2', className)}
          {...props}
        />
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'checked' | 'name' | 'onChange' | 'type'> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, disabled, value, ...props }, ref) => {
    const group = React.useContext(RadioGroupContext);

    if (!group) {
      throw new Error('RadioGroupItem must be used inside RadioGroup');
    }

    return (
      <input
        ref={ref}
        type="radio"
        name={group.name}
        value={value}
        checked={group.value === value}
        disabled={disabled || group.disabled}
        required={group.required}
        onChange={() => group.onValueChange(value)}
        className={cn(
          'h-5 w-5 shrink-0 cursor-pointer accent-yellow-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
