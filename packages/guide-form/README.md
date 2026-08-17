# Guide Form Package

> **CONFIDENTIAL** — Internal use only.

Reusable guide application form component package. UI-agnostic, type-safe, with Zod validation.

## Internal installation

This package is private and is not published to the public npm registry. Install the built package
from an approved workspace or repository checkout:

```bash
pnpm add @replit/guide-form@file:../replit_localguide/packages/guide-form/dist
```

## Peer Dependencies

```json
{
  "@hookform/resolvers": "^3.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-hook-form": "^7.0.0",
  "zod": "^3.0.0",
  "lucide-react": "^0.400.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

## Usage

```tsx
import { GuideForm } from '@replit/guide-form';

const MyGuideForm = () => {
  const config = {
    apiEndpoints: {
      submitApplication: '/api/v2/guide-applications',
      serviceCategories: '/api/v2/service-categories/with-subcategories',
    },
    auth: {
      getToken: () => user?.token || null,
      getUserId: () => user?.id || null,
    },
    callbacks: {
      onSuccess: (data) => console.log('Submitted', data),
      onError: (error) => console.error('Failed', error),
    },
  };

  return (
    <GuideForm
      config={config}
      ui={uiComponents}      // shadcn/ui compatible components
      destinations={destinations}
      allowCustomDestination
      targetGroups={TARGET_GROUP_MAP}
      locale="en"              // use "zh-CN" for Simplified Chinese
    />
  );
};
```

The configured submission endpoint must accept the host application's authenticated user. Pass
the current access token and numeric user ID through the two `auth` accessors; unauthenticated
visitors are redirected to the login page before submission.

Draft persistence is host-owned: pass `onLoadLocalStorage` and `onSaveLocalStorage` to
`GuideForm`. `apiEndpoints.submitApplication` is the only application endpoint used by the hook;
`apiEndpoints.serviceCategories`, when present, is fetched to populate Step 4 unless the host
provides `serviceCategories` or `onLoadServiceCategories` directly.

## Required UI Components

Components must follow shadcn/ui API conventions:

| Category | Components |
|----------|-----------|
| Form | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` |
| Input | `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `RadioGroupItem`, `Button`, `Progress`, `Slider` |
| Select | `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` |
| Layout | `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Badge`, `Separator` |
| Icons | `ChevronLeft`, `ChevronRight`, `Save`, `Info` (from lucide-react) |
| Optional | `YearMonthPicker`, `QualificationUploader`, `Tooltip*`, `TooltipProvider` |

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `GuideFormConfig` | Yes | API endpoints, auth, callbacks |
| `ui` | `UIComponents` | Yes | UI component map |
| `cities` | `{value, label}[]` | No | City options |
| `targetGroups` | `{value, label}[]` | No | Target group options |
| `serviceCategories` | `ServiceCategory[]` | No | Service categories |
| `onLoadServiceCategories` | `() => Promise<ServiceCategory[]>` | No | Async loader |
| `customTitle` | `string` | No | Override title |
| `customDescription` | `string` | No | Override description |
| `showProgressBar` | `boolean` | No | Show progress bar |
| `locale` | `"en" \| "zh-CN" \| "zh"` | No | Built-in page titles, Page 2/3, and selected preview values/actions |
| `t` | `(key: string) => string` | No | Host adapter for the same translated surfaces |

Page 1, Page 4, navigation, and most preview labels in the standalone package currently use
Simplified Chinese. The main LocalGuide application supplies its own complete `react-intl`
adapters for the user-facing flow.

## GuideFormConfig

```typescript
interface GuideFormConfig {
  apiEndpoints: {
    submitApplication: string;
    serviceCategories?: string;
  };
  auth: {
    getToken: () => string | null;
    getUserId: () => number | null;
  };
  callbacks: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    onSaveDraft?: (data: any) => void;
  };
}
```

## Form Steps

1. **Basic & Service Info** — Name, age, gender, MBTI, service city
2. **Self-Assessment** — Q1-Q4 choices with 1-9 tendency sliders (Q2 has no slider)
3. **Personalized Questions** — Q5-Q9 choices and short answers with 1-9 tendency sliders (Q9 has no slider)
4. **Service Type & Preferences** — Target audience, services, pricing

## Validation

Zod-based validation: required evaluation answers/sliders, age (18-120), group size (1-50), duration (1-24h), price (non-negative), cross-field (max >= min).

Page 2/3 submission fields are serialized into the shared `evaluationAnswersV2` payload through `prepareEvaluationPayload`.

Application pricing is USD-only. The schema accepts only `currency: "USD"`, loaded form data is
normalized to USD, `formatCurrency(amount)` always renders dollars, and the public conversion
helpers are `convertUsdToCents` / `convertCentsToUsd`. The former generic-currency and
`convertYuan*` helpers are intentionally not part of the shared package contract.

## Development

```bash
npm install && npm run build    # Build
npm run dev                     # Watch mode
```

## License

UNLICENSED — Proprietary LocalGuide (TinybutGiant) internal software. All Rights Reserved.
