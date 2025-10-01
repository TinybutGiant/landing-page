import { Control } from "react-hook-form";
import { useState, useEffect } from "react";
import { FormData } from "../types/schema";
import { CURRENCY_OPTIONS } from "../constants";
import { useIntl } from "react-intl";
import { formatCurrency } from "../utils/currencyUtils";

// 基础 UI 组件接口
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
  Checkbox: any;
  Badge: any;
  Separator: any;
  Card: any;
  CardContent: any;
  CardHeader: any;
  CardTitle: any;
  Slider: any;
}

interface ServiceCategory {
  id: number;
  nameCn: string;
  nameEn: string;
  subcategories: ServiceSubcategory[];
}

interface ServiceSubcategory {
  id: number;
  categoryId: number;
  nameCn: string;
  nameEn: string;
  isCustom: boolean;
}

interface Step4ServicePreferencesProps {
  control: Control<any>;
  ui: UIComponents;
  serviceCategories?: ServiceCategory[];
  targetGroups?: Array<{ value: string; label?: string }>;
  onLoadServiceCategories?: () => Promise<ServiceCategory[]>;
}

export const Step4ServicePreferences = ({ 
  control, 
  ui,
  serviceCategories: propServiceCategories,
  targetGroups = [],
  onLoadServiceCategories
}: Step4ServicePreferencesProps) => {
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
    Checkbox,
    Badge,
    Separator,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Slider
  } = ui;

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(propServiceCategories || []);
  
  // 监听serviceCategories状态变化
  useEffect(() => {
    console.log('Step4ServicePreferences: serviceCategories状态已更新:', serviceCategories);
  }, [serviceCategories]);
  const [loading, setLoading] = useState(false);

  // 加载服务类别数据
  useEffect(() => {
    if (propServiceCategories) {
      console.log('Step4ServicePreferences: 从props设置serviceCategories:', propServiceCategories);
      setServiceCategories(propServiceCategories);
      return;
    }

    if (onLoadServiceCategories) {
      const fetchServiceCategories = async () => {
        try {
          setLoading(true);
          const data = await onLoadServiceCategories();
          console.log('Step4ServicePreferences: 从API加载serviceCategories成功:', data);
          setServiceCategories(data);
        } catch (error) {
          console.error("Failed to fetch service categories:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchServiceCategories();
    }
  }, [propServiceCategories, onLoadServiceCategories]);

  return (
    <div className="space-y-8">

      {/* 服务对象选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{intl.formatMessage({ id: 'becomeGuide.step4.targetGroup' })} *</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="targetGroup"
            render={({ field }: any) => (
              <FormItem>
                <FormControl>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {targetGroups.map((group) => (
                      <div
                        key={group.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`target-${group.value}`}
                          checked={field.value?.includes(group.value) || false}
                          onCheckedChange={(checked: boolean) => {
                            const currentValues = field.value || [];
                            if (checked) {
                              field.onChange([...currentValues, group.value]);
                            } else {
                              field.onChange(
                                currentValues.filter((val: string) => val !== group.value)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`target-${group.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {intl.formatMessage({ id: `becomeGuide.step4.targetGroupOptions.${group.value}` })}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 服务项目选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{intl.formatMessage({ id: 'becomeGuide.step4.serviceItems' })} *</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">{intl.formatMessage({ id: 'becomeGuide.step4.loadingCategories' })}</div>
          ) : (
            <FormField
              control={control}
              name="serviceSelections"
              render={({ field }: any) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-4">
                      {serviceCategories.map((category) => (
                        <div key={category.id} className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-700">
                            {intl.locale === 'zh-CN' ? category.nameCn : category.nameEn}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {category.subcategories.map((subcategory) => (
                              <div
                                key={subcategory.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`service-${subcategory.id}`}
                                  checked={field.value?.includes(subcategory.id) || false}
                                  onCheckedChange={(checked: boolean) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, subcategory.id]);
                                    } else {
                                      field.onChange(
                                        currentValues.filter((val: number) => val !== subcategory.id)
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`service-${subcategory.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {intl.locale === 'zh-CN' ? subcategory.nameCn : subcategory.nameEn}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>

      {/* 服务人数设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{intl.formatMessage({ id: 'becomeGuide.step4.serviceRange' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="minPeople"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step4.minPeople' })}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={field.value || ""}
                      onChange={(e: any) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="maxPeople"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step4.maxPeople' })}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={field.value || ""}
                      onChange={(e: any) => field.onChange(parseInt(e.target.value) || 10)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* 服务时长设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{intl.formatMessage({ id: 'becomeGuide.step4.serviceDuration' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="minDuration"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step4.minDuration' })}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      value={field.value || ""}
                      onChange={(e: any) => field.onChange(parseInt(e.target.value) || 2)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="maxDuration"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step4.maxDuration' })}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="24"
                      value={field.value || ""}
                      onChange={(e: any) => field.onChange(parseInt(e.target.value) || 8)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* 定价设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{intl.formatMessage({ id: 'becomeGuide.step4.pricing' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="basicPricePerHour"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step4.basicPricePerHour' })}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={field.value || ""}
                        onChange={(e: any) => field.onChange(parseFloat(e.target.value) || 0)}
                        placeholder="30.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="additionalPricePerPerson"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step4.additionalPricePerPerson' })}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={field.value || ""}
                        onChange={(e: any) => field.onChange(parseFloat(e.target.value) || 0)}
                        placeholder="5.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="currency"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>{intl.formatMessage({ id: 'becomeGuide.step4.currency' })}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "JPY"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={intl.formatMessage({ id: 'becomeGuide.step4.currencyPlaceholder' })} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
