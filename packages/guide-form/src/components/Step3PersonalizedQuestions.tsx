import { Control } from "react-hook-form";
import { FormData } from "../types/schema";

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
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          个性化提问
        </h3>
        <p className="text-sm text-gray-600">
          打破模板化申请，评估适配度
        </p>
      </div>

      <FormField
        control={control}
        name="q1Interaction"
        render={({ field }: any) => (
          <FormItem>
            <FormLabel>
              你希望和你的客人的相处过程中有哪些互动？
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="描述你理想中的导游-客人互动方式..."
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
              请分享你最喜欢的一个日本城市角落，并说明为什么
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="可以是一个小巷、咖啡店、观景点等，分享它的特别之处..."
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
              如果客人在行程中表现出不尊重你，你会如何处理？
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="描述你的处理方式和边界原则..."
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
              如果你心情低落，还会上线接单吗？你会怎么做？
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="分享你的情绪管理和职业态度..."
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
              有没有一件事是你觉得最能代表你的地陪能力？
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="可以是一个经历、一个习惯、一个信念等..."
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
