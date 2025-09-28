import { Control } from "react-hook-form";
import { FormData } from "../types/schema";
import { useIntl } from "react-intl";

// 基础 UI 组件接口
export interface UIComponents {
  FormField: any;
  FormItem: any;
  FormLabel: any;
  FormControl: any;
  FormMessage: any;
  Textarea: any;
}

interface Step3PersonalizedQuestionsProps {
  control: Control<FormData>;
  ui: UIComponents;
}

export const Step3PersonalizedQuestions = ({ control, ui }: Step3PersonalizedQuestionsProps) => {
  const intl = useIntl();
  
  const {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Textarea
  } = ui;

  return (
    <div className="space-y-6">

      <FormField
        control={control}
        name="q1Interaction"
        render={({ field }: any) => (
          <FormItem>
            <FormLabel>
              {intl.formatMessage({ id: 'becomeGuide.step3.q1Interaction' })}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={intl.formatMessage({ id: 'becomeGuide.step3.q1InteractionPlaceholder' })}
                className="min-h-[80px]"
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="q2FavSpot"
        render={({ field }: any) => (
          <FormItem>
            <FormLabel>
              {intl.formatMessage({ id: 'becomeGuide.step3.q2FavSpot' })}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={intl.formatMessage({ id: 'becomeGuide.step3.q2FavSpotPlaceholder' })}
                className="min-h-[80px]"
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="q3BoundaryResponse"
        render={({ field }: any) => (
          <FormItem>
            <FormLabel>
              {intl.formatMessage({ id: 'becomeGuide.step3.q3BoundaryResponse' })}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={intl.formatMessage({ id: 'becomeGuide.step3.q3BoundaryResponsePlaceholder' })}
                className="min-h-[80px]"
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="q4EmotionalHandling"
        render={({ field }: any) => (
          <FormItem>
            <FormLabel>
              {intl.formatMessage({ id: 'becomeGuide.step3.q4EmotionalHandling' })}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={intl.formatMessage({ id: 'becomeGuide.step3.q4EmotionalHandlingPlaceholder' })}
                className="min-h-[80px]"
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="q5SelfSymbol"
        render={({ field }: any) => (
          <FormItem>
            <FormLabel>
              {intl.formatMessage({ id: 'becomeGuide.step3.q5SelfSymbol' })}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={intl.formatMessage({ id: 'becomeGuide.step3.q5SelfSymbolPlaceholder' })}
                className="min-h-[80px]"
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
