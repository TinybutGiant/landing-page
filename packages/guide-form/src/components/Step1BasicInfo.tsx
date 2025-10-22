import { Control } from "react-hook-form";
import { FormData } from "../types/schema";
import { SEX_OPTIONS, MBTI_OPTIONS } from "../constants";
import { useIntl } from "react-intl";

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
  const intl = useIntl();
  
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
          {intl.formatMessage({ id: 'becomeGuide.step1.basicInfo' })}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="name"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step1.name' })} *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={intl.formatMessage({ id: 'becomeGuide.step1.namePlaceholder' })}
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
                  {intl.formatMessage({ id: 'becomeGuide.step1.age' })} *
                  <span className="text-sm text-gray-500 ml-2">
                    ({intl.formatMessage({ id: 'becomeGuide.step1.ageRequirement' })})
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
                <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step1.gender' })} *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={intl.formatMessage({ id: 'becomeGuide.step1.genderPlaceholder' })} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SEX_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {intl.formatMessage({ id: option.labelKey })}
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
                  {intl.formatMessage({ id: 'becomeGuide.step1.mbti' })}
                  <span className="text-sm text-gray-500 ml-2">
                    ({intl.formatMessage({ id: 'becomeGuide.step1.mbtiDescription' })})
                  </span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "ENFJ"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={intl.formatMessage({ id: 'becomeGuide.step1.mbtiPlaceholder' })} />
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
              <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step1.socialProfile' })}</FormLabel>
              <FormControl>
                <Input
                  placeholder={intl.formatMessage({ id: 'becomeGuide.step1.socialProfilePlaceholder' })}
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
          {intl.formatMessage({ id: 'becomeGuide.step1.serviceInfo' })}
        </h3>
        <div className="space-y-4">
          <FormField
            control={control}
            name="serviceCity"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step1.serviceCity' })} *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={intl.formatMessage({ id: 'becomeGuide.step1.serviceCityPlaceholder' })} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem
                        key={city.value}
                        value={city.value}
                      >
                        {intl.formatMessage({ id: `becomeGuide.step1.cities.${city.value}` })}
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
                <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step1.residenceInfo' })}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={intl.formatMessage({ id: 'becomeGuide.step1.residenceInfoPlaceholder' })}
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
            name="residenceZipcode"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>邮政编码</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入该区域对应的邮编（如：1500001）"
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
                  <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step1.residenceStartDate' })}</FormLabel>
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
                      placeholder={intl.formatMessage({ id: 'becomeGuide.step1.residenceStartDatePlaceholder' })}
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
                <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step1.occupation' })}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={intl.formatMessage({ id: 'becomeGuide.step1.occupationPlaceholder' })}
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
                <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step1.bio' })}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={intl.formatMessage({ id: 'becomeGuide.step1.bioPlaceholder' })}
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
          {intl.formatMessage({ id: 'becomeGuide.step1.qualifications' })}
        </h3>
        <div className="space-y-4">
          {/* 语言能力 */}
          <FormField
            control={control}
            name="languages"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step1.languages' })}</FormLabel>
                <div className="flex space-x-4">
                  {["chinese", "japanese", "english"].map((languageKey) => (
                    <div
                      key={languageKey}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`language-${languageKey}`}
                        checked={
                          field.value?.includes(languageKey) ||
                          false
                        }
                        onCheckedChange={(checked: boolean) => {
                          const currentLanguages =
                            field.value || [];
                          if (checked) {
                            field.onChange([
                              ...currentLanguages,
                              languageKey,
                            ]);
                          } else {
                            field.onChange(
                              currentLanguages.filter(
                                (lang: string) =>
                                  lang !== languageKey,
                              ),
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={`language-${languageKey}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {intl.formatMessage({ id: `becomeGuide.step1.languageOptions.${languageKey}` })}
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
              {intl.formatMessage({ id: 'becomeGuide.step1.experience' })}
            </FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="experienceDuration"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step1.experienceDuration' })}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={intl.formatMessage({ id: 'becomeGuide.step1.experienceDurationPlaceholder' })}
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
                    <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step1.experienceSession' })}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={intl.formatMessage({ id: 'becomeGuide.step1.experienceSessionPlaceholder' })}
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
