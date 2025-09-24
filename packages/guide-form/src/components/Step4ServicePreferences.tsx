import { Control } from "react-hook-form";
import { useState, useEffect } from "react";
import { FormData } from "../types/schema";
import { CURRENCY_OPTIONS } from "../constants";

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
  control: Control<FormData>;
  ui: UIComponents;
  serviceCategories?: ServiceCategory[];
  targetGroups?: Array<{ value: string; label: string }>;
  onLoadServiceCategories?: () => Promise<ServiceCategory[]>;
}

export const Step4ServicePreferences = ({ 
  control, 
  ui,
  serviceCategories: propServiceCategories,
  targetGroups = [],
  onLoadServiceCategories
}: Step4ServicePreferencesProps) => {
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
  const [loading, setLoading] = useState(false);

  // 加载服务类别数据
  useEffect(() => {
    if (propServiceCategories) {
      setServiceCategories(propServiceCategories);
      return;
    }

    if (onLoadServiceCategories) {
      const fetchServiceCategories = async () => {
        try {
          setLoading(true);
          const data = await onLoadServiceCategories();
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
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          服务类型与偏好
        </h3>
        <p className="text-sm text-gray-600">
          设置您的服务范围、定价和偏好
        </p>
      </div>

      {/* 服务对象选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">服务对象 *</CardTitle>
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
                          {group.label}
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
          <CardTitle className="text-base">服务项目 *</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">加载中...</div>
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
                            {category.nameCn}
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
                                  {subcategory.nameCn}
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
          <CardTitle className="text-base">服务人数设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="minPeople"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>最少人数</FormLabel>
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
                  <FormLabel>最多人数</FormLabel>
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
          <CardTitle className="text-base">服务时长设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="minDuration"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>最短时长（小时）</FormLabel>
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
                  <FormLabel>最长时长（小时）</FormLabel>
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
          <CardTitle className="text-base">定价设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="basicPricePerHourCents"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>基础时薪（分）</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        value={field.value || ""}
                        onChange={(e: any) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="additionalPricePerPersonCents"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>额外人员费用（分）</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        value={field.value || ""}
                        onChange={(e: any) => field.onChange(parseInt(e.target.value) || 0)}
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
                  <FormLabel>货币类型</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || "JPY"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择货币类型" />
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
