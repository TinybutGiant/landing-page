import { Control } from "react-hook-form";
import { FormData } from "../types/schema";
import { SCORE_EXPLANATIONS } from "../constants";
import { useIntl } from "react-intl";

// 基础 UI 组件接口
export interface UIComponents {
  FormField: any;
  FormItem: any;
  FormLabel: any;
  FormControl: any;
  FormMessage: any;
  Textarea: any;
  Slider: any;
  Tooltip?: any;
  TooltipContent?: any;
  TooltipTrigger?: any;
  Info?: any;
}

interface Step2SelfAssessmentProps {
  control: Control<FormData>;
  ui: UIComponents;
}

export const Step2SelfAssessment = ({ control, ui }: Step2SelfAssessmentProps) => {
  const intl = useIntl();
  
  const {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Textarea,
    Slider,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    Info
  } = ui;

  return (
    <div className="space-y-8">

      {/* 道德感评分 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FormLabel className="text-base font-medium">
            {intl.formatMessage({ id: 'becomeGuide.step2.ethicsScore' })}
          </FormLabel>
          {Tooltip && Info && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-sm">
                  <p className="font-medium">
                    {SCORE_EXPLANATIONS.ethics.title}
                  </p>
                  <p className="text-sm">
                    {SCORE_EXPLANATIONS.ethics.description}
                  </p>
                  <p className="text-xs mt-1">
                    {SCORE_EXPLANATIONS.ethics.ranges}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <FormField
          control={control}
          name="ethicsScore"
          render={({ field }: any) => (
            <FormItem>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={[field.value || 5]}
                    onValueChange={(value: number[]) =>
                      field.onChange(value[0])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{intl.formatMessage({ id: 'becomeGuide.step2.ethicsRange0' })}</span>
                    <span className="font-medium">
                      {intl.formatMessage({ id: 'becomeGuide.step2.currentScore' }, { value: field.value })}/10
                    </span>
                    <span>{intl.formatMessage({ id: 'becomeGuide.step2.ethicsRange10' })}</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="ethicsDescription"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step2.ethicsDescription' })}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={intl.formatMessage({ id: 'becomeGuide.step2.ethicsDescriptionPlaceholder' })}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 边界感评分 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FormLabel className="text-base font-medium">
            {intl.formatMessage({ id: 'becomeGuide.step2.boundaryScore' })}
          </FormLabel>
          {Tooltip && Info && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-sm">
                  <p className="font-medium">
                    {SCORE_EXPLANATIONS.boundary.title}
                  </p>
                  <p className="text-sm">
                    {SCORE_EXPLANATIONS.boundary.description}
                  </p>
                  <p className="text-xs mt-1">
                    {SCORE_EXPLANATIONS.boundary.ranges}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <FormField
          control={control}
          name="boundaryScore"
          render={({ field }: any) => (
            <FormItem>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={[field.value || 5]}
                    onValueChange={(value: number[]) =>
                      field.onChange(value[0])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{intl.formatMessage({ id: 'becomeGuide.step2.boundaryRange0' })}</span>
                    <span className="font-medium">
                      {intl.formatMessage({ id: 'becomeGuide.step2.currentScore' }, { value: field.value })}/10
                    </span>
                    <span>{intl.formatMessage({ id: 'becomeGuide.step2.boundaryRange10' })}</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="boundaryDescription"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({ id: 'becomeGuide.step2.boundaryDescription' })}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={intl.formatMessage({ id: 'becomeGuide.step2.boundaryDescriptionPlaceholder' })}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 应变力评分 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FormLabel className="text-base font-medium">
            {intl.formatMessage({ id: 'becomeGuide.step2.supportiveScore' })}
          </FormLabel>
          {Tooltip && Info && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-sm">
                  <p className="font-medium">
                    {SCORE_EXPLANATIONS.supportive.title}
                  </p>
                  <p className="text-sm">
                    {SCORE_EXPLANATIONS.supportive.description}
                  </p>
                  <p className="text-xs mt-1">
                    {SCORE_EXPLANATIONS.supportive.ranges}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <FormField
          control={control}
          name="supportiveScore"
          render={({ field }: any) => (
            <FormItem>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={[field.value || 5]}
                    onValueChange={(value: number[]) =>
                      field.onChange(value[0])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{intl.formatMessage({ id: 'becomeGuide.step2.supportiveRange0' })}</span>
                    <span className="font-medium">
                      {intl.formatMessage({ id: 'becomeGuide.step2.currentScore' }, { value: field.value })}/10
                    </span>
                    <span>{intl.formatMessage({ id: 'becomeGuide.step2.supportiveRange10' })}</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="supportiveDescription"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({ id: 'becomeGuide.step2.supportiveDescription' })}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={intl.formatMessage({ id: 'becomeGuide.step2.supportiveDescriptionPlaceholder' })}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
