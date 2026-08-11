import type { ReactNode } from 'react';
import { useWatch, type Control } from 'react-hook-form';
import type { FormData } from '../types/schema';
import {
  createGuideFormTranslator,
  type GuideFormLocale,
  type TranslationFunction,
} from '../i18n';
import type { EvaluationQuestionUI } from './Step2SelfAssessment';
import { EvaluationSlider } from './EvaluationSlider';

export interface Step3PersonalizedQuestionsProps {
  control: Control<FormData> | Control<any>;
  ui: EvaluationQuestionUI;
  t?: TranslationFunction;
  locale?: GuideFormLocale;
}

const Q5_OPTIONS = [
  'photogenicScenery',
  'hiddenLocalExperience',
  'historyAndCulture',
  'foodAndDailyLife',
  'quietAtmosphere',
  'seasonalScenery',
  'authenticDailyLife',
  'guestFit',
] as const;

const Q6_OPTIONS = [
  'stateBoundary',
  'adjustInteraction',
  'contactPlatform',
  'stopService',
  'endureSilently',
  'argue',
] as const;

const Q7_OPTIONS = [
  'assessAndStayProfessional',
  'reduceSocialInteraction',
  'communicateEarly',
  'alwaysContinue',
  'expressEmotion',
] as const;

const Q8_OPTIONS = [
  'hiddenSpots',
  'conversation',
  'planning',
  'adaptability',
  'photography',
  'food',
  'shopping',
  'transportation',
  'firstTimeVisitors',
  'observeNeeds',
  'respectPace',
  'multilingual',
  'unexpectedSituations',
] as const;

const QuestionCard = ({ children }: { children: ReactNode }) => (
  <div className="space-y-4 rounded-lg border border-gray-200 bg-[#F9FAFB] p-5 dark:border-gray-700 dark:bg-gray-800/40">
    {children}
  </div>
);

const CharacterCount = ({ value, max }: { value: string; max: number }) => (
  <p className="text-right text-xs text-gray-400 dark:text-gray-300">
    {value.length}/{max}
  </p>
);

export const Step3PersonalizedQuestions = ({
  control,
  ui,
  t,
  locale = 'en',
}: Step3PersonalizedQuestionsProps) => {
  const {
    Checkbox,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    RadioGroup,
    RadioGroupItem,
    Textarea,
  } = ui;
  const translate = t ?? createGuideFormTranslator(locale);
  const q8Example = useWatch({ control, name: 'personalizedQ8Example' }) || '';
  const q9Answer = useWatch({ control, name: 'personalizedQ9' }) || '';

  return (
    <div className="space-y-[30px]">
      <div className="text-center">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {translate('becomeGuide.step3.title')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-white">
          {translate('becomeGuide.step3.subtitle')}
        </p>
      </div>

      <QuestionCard>
        <FormField
          control={control}
          name="personalizedQ5"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-900 dark:text-white">
                {translate('becomeGuide.step3.q5Question')}
              </FormLabel>
              <div className="space-y-3 pt-1">
                {Q5_OPTIONS.map((option) => {
                  const id = `personalized-q5-${option}`;
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
                        {translate(`becomeGuide.step3.q5Options.${option}`)}
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
          name="personalizedQ5Slider"
          render={({ field }: any) => (
            <EvaluationSlider
              ui={ui}
              title={translate('becomeGuide.step3.q5SliderTitle')}
              tooltip={translate('becomeGuide.step3.q5SliderTooltip')}
              instruction={translate('becomeGuide.step3.sliderInstruction')}
              unselectedLabel={translate('becomeGuide.step3.sliderUnselected')}
              rangeStart={translate('becomeGuide.step3.q5Range1')}
              rangeEnd={translate('becomeGuide.step3.q5Range9')}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </QuestionCard>

      <QuestionCard>
        <FormField
          control={control}
          name="personalizedQ6"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-900 dark:text-white">
                {translate('becomeGuide.step3.q6Question')}
              </FormLabel>
              <div className="space-y-3 pt-1">
                {Q6_OPTIONS.map((option) => {
                  const id = `personalized-q6-${option}`;
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
                        {translate(`becomeGuide.step3.q6Options.${option}`)}
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
          name="personalizedQ6Slider"
          render={({ field }: any) => (
            <EvaluationSlider
              ui={ui}
              title={translate('becomeGuide.step3.q6SliderTitle')}
              tooltip={translate('becomeGuide.step3.q6SliderTooltip')}
              instruction={translate('becomeGuide.step3.sliderInstruction')}
              unselectedLabel={translate('becomeGuide.step3.sliderUnselected')}
              rangeStart={translate('becomeGuide.step3.q6Range1')}
              rangeEnd={translate('becomeGuide.step3.q6Range9')}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </QuestionCard>

      <QuestionCard>
        <FormField
          control={control}
          name="personalizedQ7"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-900 dark:text-white">
                {translate('becomeGuide.step3.q7Question')}
              </FormLabel>
              <FormControl>
                <RadioGroup value={field.value || ''} onValueChange={field.onChange} className="pt-1">
                  {Q7_OPTIONS.map((option) => {
                    const id = `personalized-q7-${option}`;
                    return (
                      <div key={option} className="flex items-center gap-3">
                        <RadioGroupItem id={id} value={option} />
                        <label htmlFor={id} className="cursor-pointer text-sm leading-6 text-gray-700 dark:text-gray-200">
                          {translate(`becomeGuide.step3.q7Options.${option}`)}
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
          name="personalizedQ7Slider"
          render={({ field }: any) => (
            <EvaluationSlider
              ui={ui}
              title={translate('becomeGuide.step3.q7SliderTitle')}
              tooltip={translate('becomeGuide.step3.q7SliderTooltip')}
              instruction={translate('becomeGuide.step3.sliderInstruction')}
              unselectedLabel={translate('becomeGuide.step3.sliderUnselected')}
              rangeStart={translate('becomeGuide.step3.q7Range1')}
              rangeEnd={translate('becomeGuide.step3.q7Range9')}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </QuestionCard>

      <QuestionCard>
        <FormField
          control={control}
          name="personalizedQ8Strengths"
          render={({ field }: any) => (
            <FormItem>
              <div>
                <FormLabel className="text-lg font-semibold text-gray-900 dark:text-white">
                  {translate('becomeGuide.step3.q8Question')}
                </FormLabel>
              </div>
              <div className="grid gap-3 pt-1 sm:grid-cols-2">
                {Q8_OPTIONS.map((option) => {
                  const id = `personalized-q8-${option}`;
                  const selected = (field.value || []).includes(option);
                  const selectionLimitReached = (field.value || []).length >= 3 && !selected;
                  return (
                    <div key={option} className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          id={id}
                          checked={selected}
                          disabled={selectionLimitReached}
                          onCheckedChange={(checked: boolean) =>
                            field.onChange(
                              checked
                                ? [...(field.value || []), option]
                                : (field.value || []).filter((value: string) => value !== option)
                            )
                          }
                        />
                      </FormControl>
                      <label
                        htmlFor={id}
                        className={`text-sm leading-6 ${
                          selectionLimitReached
                            ? 'cursor-not-allowed text-gray-400'
                            : 'cursor-pointer text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {translate(`becomeGuide.step3.q8Options.${option}`)}
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
          name="personalizedQ8Example"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {translate('becomeGuide.step3.q8ExampleQuestion')}
              </FormLabel>
              <FormControl>
                <Textarea
                  maxLength={100}
                  placeholder={translate('becomeGuide.step3.q8ExamplePlaceholder')}
                  className="min-h-[90px]"
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              </FormControl>
              <CharacterCount value={q8Example} max={100} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="personalizedQ8Slider"
          render={({ field }: any) => (
            <EvaluationSlider
              ui={ui}
              title={translate('becomeGuide.step3.q8SliderTitle')}
              tooltip={translate('becomeGuide.step3.q8SliderTooltip')}
              instruction={translate('becomeGuide.step3.sliderInstruction')}
              unselectedLabel={translate('becomeGuide.step3.sliderUnselected')}
              rangeStart={translate('becomeGuide.step3.q8Range1')}
              rangeEnd={translate('becomeGuide.step3.q8Range9')}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </QuestionCard>

      <QuestionCard>
        <FormField
          control={control}
          name="personalizedQ9"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-900 dark:text-white">
                {translate('becomeGuide.step3.q9Question')}
              </FormLabel>
              <FormControl>
                <Textarea
                  maxLength={50}
                  placeholder={translate('becomeGuide.step3.q9Placeholder')}
                  className="min-h-[90px]"
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              </FormControl>
              <CharacterCount value={q9Answer} max={50} />
              <FormMessage />
            </FormItem>
          )}
        />
      </QuestionCard>
    </div>
  );
};
