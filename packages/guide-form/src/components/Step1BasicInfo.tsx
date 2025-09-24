import { Control } from "react-hook-form";
import { FormData } from "../types/schema";
import { SEX_OPTIONS, MBTI_OPTIONS } from "../constants";

// 基础 UI 组件接口 - 需要由使用者提供实现
export interface UIComponents {
  FormField: any;
  FormItem: any;
  FormLabel: any;
  FormControl: any;
  FormMessage: any;
  Input: any;
  Select: any;
  SelectContent: any;
  SelectItem: any;
  SelectTrigger: any;
  SelectValue: any;
  Textarea: any;
  Checkbox: any;
  YearMonthPicker: any;
  QualificationUploader?: any;
}

interface Step1BasicInfoProps {
  control: Control<FormData>;
  handleQualificationFilesChange: (files: any) => void;
  ui: UIComponents;
  cities?: Array<{ value: string; label: string }>;
}

export const Step1BasicInfo = ({ 
  control, 
  handleQualificationFilesChange, 
  ui,
  cities = []
}: Step1BasicInfoProps) => {
  const {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
    Checkbox,
    YearMonthPicker,
    QualificationUploader
  } = ui;

  return (
    <div className="space-y-6">
      {/* 基本信息部分 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          基本信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="name"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>姓名 *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入您的姓名"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="age"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>
                  年龄 *
                  <span className="text-sm text-gray-500 ml-2">
                    (至少需要18岁)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="18"
                    max="120"
                    value={field.value?.toString() || ""}
                    onChange={(e: any) =>
                      field.onChange(
                        parseInt(e.target.value) || 18,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="sex"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>性别 *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择性别" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SEX_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="mbti"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>
                  MBTI人格类型
                  <span className="text-sm text-gray-500 ml-2">
                    (帮助我们更好地了解您的性格特点)
                  </span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "ENFJ"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择您的MBTI类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MBTI_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="socialProfile"
          render={({ field }: any) => (
            <FormItem className="mt-4">
              <FormLabel>小红书 / Instagram主页链接</FormLabel>
              <FormControl>
                <Input
                  placeholder="请输入您的社交媒体主页链接"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 服务信息部分 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          服务信息
        </h3>
        <div className="space-y-4">
          <FormField
            control={control}
            name="serviceCity"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>可服务的城市 *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="如：大阪 / 东京 / 京都等" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem
                        key={city.value}
                        value={city.value}
                      >
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="residenceInfo"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>您的住址/常驻区域</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="便于估算通勤时间（如：新宿区、涩谷附近等）"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {YearMonthPicker && (
            <FormField
              control={control}
              name="residenceStartDate"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>在日本生活的起始时间</FormLabel>
                  <FormControl>
                    <YearMonthPicker
                      value={
                        field.value
                          ? new Date(field.value)
                          : undefined
                      }
                      onChange={(date: Date) => {
                        field.onChange(
                          date
                            ? date.toISOString().split("T")[0]
                            : "",
                        );
                      }}
                      placeholder="请选择开始在日本生活的年月"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={control}
            name="occupation"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>当前职业 / 身份</FormLabel>
                <FormControl>
                  <Input
                    placeholder="如：留学生、公司员工、自由职业者等"
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
            name="bio"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>用一段话介绍你自己吧</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="你希望客人看到你哪一面？分享你的特长、兴趣或独特经历..."
                    className="min-h-[100px]"
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

      {/* 资质与经验 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          资质与经验
        </h3>
        <div className="space-y-4">
          {/* 语言能力 */}
          <FormField
            control={control}
            name="languages"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>你可以提供服务的语言能力</FormLabel>
                <div className="flex space-x-4">
                  {["中文", "日语", "英文"].map((language) => (
                    <div
                      key={language}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`language-${language}`}
                        checked={
                          field.value?.includes(language) ||
                          false
                        }
                        onCheckedChange={(checked: boolean) => {
                          const currentLanguages =
                            field.value || [];
                          if (checked) {
                            field.onChange([
                              ...currentLanguages,
                              language,
                            ]);
                          } else {
                            field.onChange(
                              currentLanguages.filter(
                                (lang: string) =>
                                  lang !== language,
                              ),
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={`language-${language}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {language}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 地陪经验 */}
          <div className="space-y-4">
            <FormLabel className="text-base font-medium">
              地陪经验
            </FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="experienceDuration"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>做地陪的时长</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="如：2年、6个月等"
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
                name="experienceSession"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>具体次数</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="如：50次左右、100+次等"
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

          {QualificationUploader && (
            <FormField
              control={control}
              name="qualifications"
              render={({ field }: any) => (
                <FormItem>
                  <FormControl>
                    <QualificationUploader
                      value={field.value || { certifications: {} }}
                      onChange={(files: any) => {
                        field.onChange(files);
                        handleQualificationFilesChange(files.certifications);
                      }}
                      maxFiles={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};
