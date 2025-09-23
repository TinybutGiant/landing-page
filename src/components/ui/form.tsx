import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
} from "react-hook-form";

// Minimal shadcn/ui-compatible form primitives used by the GuideForm package

const Form = FormProvider as unknown as React.FC<{ children: React.ReactNode } & any>;

const FormField: React.FC<any> = ({ ...props }) => {
  return <Controller {...props} />;
};

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function FormItem(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={className} {...props} />;
});

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(function FormLabel(
  { className, ...props },
  ref
) {
  return <label ref={ref} className={className} {...props} />;
});

const FormControl = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<typeof Slot>>(function FormControl(
  { ...props },
  ref
) {
  return <Slot ref={ref as any} {...props} />;
});

const FormMessage: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = (props) => {
  // Controller will inject fieldState.error in render prop; consumers often don't pass it here
  // so this is a simple placeholder component for compatibility
  return <p className={props.className}>{props.children}</p>;
};

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };


