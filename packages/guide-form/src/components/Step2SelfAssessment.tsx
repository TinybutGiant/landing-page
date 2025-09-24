import { Control } from "react-hook-form";
import { FormData } from "../types/schema";
import { SCORE_EXPLANATIONS } from "../constants";

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
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          自我认知评估
        </h3>
        <p className="text-sm text-gray-600">
          用于匹配"天选地陪"标签，请诚实评价自己
        </p>
      </div>

      {/* 道德感评分 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FormLabel className="text-base font-medium">
            道德感评分
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
                    <span>0 - 包容</span>
                    <span className="font-medium">
                      当前: {field.value}/10
                    </span>
                    <span>10 - 规矩</span>
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
              <FormLabel>请简述你对"有道德感"的理解</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="分享你对道德、承诺、规则的看法..."
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
            边界感评分
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
                    <span>0 - 外放</span>
                    <span className="font-medium">
                      当前: {field.value}/10
                    </span>
                    <span>10 - 稳重</span>
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
                请简述你如何处理他人请求与自我空间的关系
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="分享你如何平衡服务他人和保护自己的边界..."
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
            应变力评分
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
                    <span>0 - 木讷</span>
                    <span className="font-medium">
                      当前: {field.value}/10
                    </span>
                    <span>10 - 主导型</span>
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
                请描述你如何让身边的人感到被理解或舒服
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="分享你的社交技巧和氛围调节能力..."
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
