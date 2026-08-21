import type { ReactNode } from 'react';
import type { Control } from 'react-hook-form';
import type { FormData } from '../types/schema';
import {
  createGuideFormTranslator,
  type GuideFormLocale,
  type TranslationFunction,
} from '../i18n';
import { EvaluationSlider, type EvaluationSliderUI } from './EvaluationSlider';

export interface EvaluationQuestionUI extends EvaluationSliderUI {
  Checkbox: any;
  FormControl: any;
  FormField: any;
  FormItem: any;
  FormLabel: any;
  FormMessage: any;
  RadioGroup: any;
  RadioGroupItem: any;
  Textarea: any;
}

export interface Step2SelfAssessmentProps {
  control: Control<FormData> | Control<any>;
  ui: EvaluationQuestionUI;
  t?: TranslationFunction;
  locale?: GuideFormLocale;
}

const Q1_OPTIONS = [
  'understandRequest',
  'refuseUnsafe',
  'offerAlternative',
  'contactPlatform',
  'satisfyFirst',
  'doNotEngage',
] as const;

const Q3_OPTIONS = [
  'askAndSupport',
  'observeThenCheck',
  'activelyHelp',
  'waitForRequest',
  'doNotIntervene',
] as const;

const Q4_OPTIONS = [
  'shareStories',
  'localConnections',
  'takePhotos',
  'adjustPace',
  'quietCompany',
  'giveSpace',
  'stayInTouch',
  'professionalRelationship',
] as const;

const QuestionCard = ({ children }: { children: ReactNode }) => (
  <div className="space-y-4 rounded-lg border border-gray-200 bg-[#F9FAFB] p-5 dark:border-gray-700 dark:bg-gray-800/40">
    {children}
  </div>
);

export const Step2SelfAssessment = ({
  control,
  ui,
  t,
  locale = 'en',
}: Step2SelfAssessmentProps) => {
  const {
    Checkbox,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    RadioGroup,
    RadioGroupItem,
  } = ui;
  const translate = t ?? createGuideFormTranslator(locale);

  return (
    <div className="space-y-[30px]">
      <div className="text-center">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {translate('becomeGuide.step2.title')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-white">
          {translate('becomeGuide.step2.subtitle')}
        </p>
      </div>

      <QuestionCard>
        <FormField
          control={control}
          name="assessmentQ1"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-900 dark:text-white">
                {translate('becomeGuide.step2.q1Question')}
              </FormLabel>
              <div className="space-y-3 pt-1">
                {Q1_OPTIONS.map((option) => {
                  const id = `assessment-q1-${option}`;
                  const selected = (field.value || []).includes(option);
                  return (
                    <div key={option} className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          id={id}
                          checked={selected}
                          onCheckedChange={(checked: boolean) =>
                            field.onChange(
                              checked
                                ? [...(field.value || []), option]
                                : (field.value || []).filter((value: string) => value !== option)
                            )
                          }
                        />
                      </FormControl>
                      <label htmlFor={id} className="cursor-pointer text-sm leading-6 text-gray-700 dark:text-gray-200">
                        {translate(`becomeGuide.step2.q1Options.${option}`)}
                      </label>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="assessmentQ1Slider"
          render={({ field }: any) => (
            <EvaluationSlider
              ui={ui}
              title={translate('becomeGuide.step2.q1SliderTitle')}
              tooltip={translate('becomeGuide.step2.q1SliderTooltip')}
              instruction={translate('becomeGuide.step2.sliderInstruction')}
              unselectedLabel={translate('becomeGuide.step2.sliderUnselected')}
              rangeStart={translate('becomeGuide.step2.q1Range1')}
              rangeEnd={translate('becomeGuide.step2.q1Range9')}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </QuestionCard>

      <QuestionCard>
        <FormField
          control={control}
          name="assessmentQ3"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-900 dark:text-white">
                {translate('becomeGuide.step2.q3Question')}
              </FormLabel>
              <FormControl>
                <RadioGroup value={field.value || ''} onValueChange={field.onChange} className="pt-1">
                  {Q3_OPTIONS.map((option) => {
                    const id = `assessment-q3-${option}`;
                    return (
                      <div key={option} className="flex items-center gap-3">
                        <RadioGroupItem id={id} value={option} />
                        <label htmlFor={id} className="cursor-pointer text-sm leading-6 text-gray-700 dark:text-gray-200">
                          {translate(`becomeGuide.step2.q3Options.${option}`)}
                        </label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="assessmentQ3Slider"
          render={({ field }: any) => (
            <EvaluationSlider
              ui={ui}
              title={translate('becomeGuide.step2.q3SliderTitle')}
              tooltip={translate('becomeGuide.step2.q3SliderTooltip')}
              instruction={translate('becomeGuide.step2.sliderInstruction')}
              unselectedLabel={translate('becomeGuide.step2.sliderUnselected')}
              rangeStart={translate('becomeGuide.step2.q3Range1')}
              rangeEnd={translate('becomeGuide.step2.q3Range9')}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </QuestionCard>

      <QuestionCard>
        <FormField
          control={control}
          name="assessmentQ4"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-900 dark:text-white">
                {translate('becomeGuide.step2.q4Question')}
              </FormLabel>
              <div className="space-y-3 pt-1">
                {Q4_OPTIONS.map((option) => {
                  const id = `assessment-q4-${option}`;
                  const selected = (field.value || []).includes(option);
                  return (
                    <div key={option} className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          id={id}
                          checked={selected}
                          onCheckedChange={(checked: boolean) =>
                            field.onChange(
                              checked
                                ? [...(field.value || []), option]
                                : (field.value || []).filter((value: string) => value !== option)
                            )
                          }
                        />
                      </FormControl>
                      <label htmlFor={id} className="cursor-pointer text-sm leading-6 text-gray-700 dark:text-gray-200">
                        {translate(`becomeGuide.step2.q4Options.${option}`)}
                      </label>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="assessmentQ4Slider"
          render={({ field }: any) => (
            <EvaluationSlider
              ui={ui}
              title={translate('becomeGuide.step2.q4SliderTitle')}
              tooltip={translate('becomeGuide.step2.q4SliderTooltip')}
              instruction={translate('becomeGuide.step2.sliderInstruction')}
              unselectedLabel={translate('becomeGuide.step2.sliderUnselected')}
              rangeStart={translate('becomeGuide.step2.q4Range1')}
              rangeEnd={translate('becomeGuide.step2.q4Range9')}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </QuestionCard>
    </div>
  );
};
