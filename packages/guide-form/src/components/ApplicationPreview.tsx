import { ChevronLeft } from "lucide-react";
import { FormData, GuideFormDestination } from "../types/schema";

export interface UIComponents {
  Card: any;
  CardContent: any;
  Button: any;
  Checkbox: any;
}

interface ApplicationPreviewProps {
  formData: Partial<FormData>;
  missingFields: string[];
  confirmationChecked: boolean;
  setConfirmationChecked: (checked: boolean) => void;
  onBackToForm: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  requiresAccountBeforeSubmit?: boolean;
  validateFormCompleteness: (formData: Partial<FormData>) => string[];
  setMissingFields: (fields: string[]) => void;
  destinations?: GuideFormDestination[];
  ui: UIComponents;
  intl?: any;
}

const MISSING_FIELD_LABEL_KEYS: Record<string, string> = {
  "becomeGuide.step2.q1Question": "becomeGuide.preview.missingFieldLabels.step2Q1Answer",
  "becomeGuide.step2.q1SliderTitle": "becomeGuide.preview.missingFieldLabels.step2Q1Score",
  "becomeGuide.step2.q2Question": "becomeGuide.preview.missingFieldLabels.step2Q2Answer",
  "becomeGuide.step2.q3Question": "becomeGuide.preview.missingFieldLabels.step2Q3Answer",
  "becomeGuide.step2.q3SliderTitle": "becomeGuide.preview.missingFieldLabels.step2Q3Score",
  "becomeGuide.step2.q4Question": "becomeGuide.preview.missingFieldLabels.step2Q4Answer",
  "becomeGuide.step2.q4SliderTitle": "becomeGuide.preview.missingFieldLabels.step2Q4Score",
  "becomeGuide.step3.q5Question": "becomeGuide.preview.missingFieldLabels.step3Q5Answer",
  "becomeGuide.step3.q5SliderTitle": "becomeGuide.preview.missingFieldLabels.step3Q5Score",
  "becomeGuide.step3.q6Question": "becomeGuide.preview.missingFieldLabels.step3Q6Answer",
  "becomeGuide.step3.q6SliderTitle": "becomeGuide.preview.missingFieldLabels.step3Q6Score",
  "becomeGuide.step3.q7Question": "becomeGuide.preview.missingFieldLabels.step3Q7Answer",
  "becomeGuide.step3.q7SliderTitle": "becomeGuide.preview.missingFieldLabels.step3Q7Score",
  "becomeGuide.step3.q8Question": "becomeGuide.preview.missingFieldLabels.step3Q8Strengths",
  "becomeGuide.step3.q8SliderTitle": "becomeGuide.preview.missingFieldLabels.step3Q8Score",
  "becomeGuide.step3.q8ExampleQuestion": "becomeGuide.preview.missingFieldLabels.step3Q8Example",
  "becomeGuide.step3.q9Question": "becomeGuide.preview.missingFieldLabels.step3Q9Description",
  "becomeGuide.preview.serviceAreas": "becomeGuide.preview.missingFieldLabels.serviceAreas",
};

const targetGroupLabelKeys: Record<string, string> = {
  individual: "becomeGuide.preview.individual",
  couple: "becomeGuide.preview.couple",
  family: "becomeGuide.preview.family",
  group: "becomeGuide.preview.group",
  child: "becomeGuide.preview.child",
  elderly: "becomeGuide.preview.elderly",
  business: "becomeGuide.preview.business",
};

export const ApplicationPreview = ({
  formData,
  missingFields,
  confirmationChecked,
  setConfirmationChecked,
  onBackToForm,
  onSubmit,
  isSubmitting,
  requiresAccountBeforeSubmit = false,
  validateFormCompleteness,
  setMissingFields,
  destinations = [],
  ui,
  intl,
}: ApplicationPreviewProps) => {
  const { Card, CardContent, Button, Checkbox } = ui;
  const t = (id: string, defaultMessage = id, values?: Record<string, any>) =>
    intl?.formatMessage({ id, defaultMessage }, values) ?? defaultMessage;
  const ph = t("becomeGuide.preview.placeholder", "-");
  const list = (values: string[] | undefined) =>
    values?.length ? values.join(t("becomeGuide.preview.fieldSeparator", ", ")) : ph;
  const formatMissingField = (field: string) => t(MISSING_FIELD_LABEL_KEYS[field] ?? field, field);
  const destinationById = new Map(destinations.map((destination) => [destination.id, destination]));
  const destinationLabel = (destination: GuideFormDestination) => {
    const locale = intl?.locale ?? "en";
    if (locale.startsWith("zh")) {
      return destination.nameZhCn || destination.nameEn || destination.nameJa || destination.slug;
    }
    if (locale.startsWith("ja")) {
      return destination.nameJa || destination.nameEn || destination.nameZhCn || destination.slug;
    }
    return destination.nameEn || destination.nameJa || destination.nameZhCn || destination.slug;
  };
  const serviceAreaLabels = [
    ...(formData.serviceAreas?.map((area) => destinationLabel(area as GuideFormDestination)) ?? []),
    ...((formData.serviceAreaDestinationIds ?? [])
      .map((id) => destinationById.get(Number(id)))
      .filter(Boolean)
      .map((destination) => destinationLabel(destination as GuideFormDestination))),
  ];
  const customProposalLabels = formData.customServiceAreaProposals ?? [];
  const serviceAreaValue =
    Array.from(new Set([...serviceAreaLabels, ...customProposalLabels])).join(
      t("becomeGuide.preview.fieldSeparator", ", ")
    ) || ph;

  const handleSubmit = () => {
    if (!confirmationChecked) return;

    const missing = validateFormCompleteness(formData);
    if (missing.length > 0) {
      setMissingFields(missing);
      return;
    }

    setMissingFields([]);
    onSubmit();
  };

  const optionLabels = (step: 2 | 3, question: string, values?: string[]) =>
    values?.length
      ? values.map((value) => t(`becomeGuide.step${step}.${question}Options.${value}`, value)).join(", ")
      : ph;

  const singleOption = (step: 2 | 3, question: string, value?: string) =>
    value ? t(`becomeGuide.step${step}.${question}Options.${value}`, value) : ph;

  const score = (value?: number | null) =>
    value == null ? ph : t("becomeGuide.preview.scoreOutOfNine", "{score}/9", { score: value });

  const row = (label: string, value: any) => (
    <div>
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <p className="text-gray-900 whitespace-pre-wrap">{value || ph}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-yellow-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("becomeGuide.preview.title", "Application Preview")}
          </h1>
          <p className="text-gray-600 mb-4">
            {t(
              "becomeGuide.preview.subtitle",
              "Review your application details before submitting."
            )}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent id="print-root" className="p-6 space-y-8">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                {t("becomeGuide.preview.basicInfo", "Basic Information")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {row(t("becomeGuide.preview.name", "Name"), formData.name)}
                {row(
                  t("becomeGuide.preview.age", "Age"),
                  formData.age
                    ? t("becomeGuide.preview.ageValue", "{years} years old", {
                        years: formData.age,
                      })
                    : ph
                )}
                {row(
                  t("becomeGuide.preview.gender", "Gender"),
                  formData.sex === "Male"
                    ? t("becomeGuide.preview.male", "Male")
                    : formData.sex === "Female"
                      ? t("becomeGuide.preview.female", "Female")
                      : t("becomeGuide.preview.preferNotToSay", "Prefer not to say")
                )}
                {row(t("becomeGuide.preview.mbti", "MBTI"), formData.mbti)}
                <div className="md:col-span-2">
                  {row(t("becomeGuide.preview.socialProfile", "Social profile"), formData.socialProfile)}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                {t("becomeGuide.preview.serviceInfo", "Service Information")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {row(t("becomeGuide.preview.serviceAreas", "Service Areas"), serviceAreaValue)}
                {row(
                  t("becomeGuide.preview.residenceStartDate", "Residence in Japan since"),
                  formData.residenceStartDate
                )}
                <div className="md:col-span-2">
                  {row(t("becomeGuide.preview.residenceInfo", "Address / area"), formData.residenceInfo)}
                </div>
                {row(t("becomeGuide.preview.residenceZipcode", "Postal code"), formData.residenceZipcode)}
                {row(t("becomeGuide.preview.occupation", "Occupation"), formData.occupation)}
                <div className="md:col-span-2">
                  {row(t("becomeGuide.preview.bio", "Bio"), formData.bio)}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                {t("becomeGuide.preview.qualifications", "Qualifications & Experience")}
              </h3>
              <div className="space-y-4">
                {row(t("becomeGuide.preview.languages", "Languages"), list(formData.languages))}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {row(t("becomeGuide.preview.guideExperience", "Guide experience"), formData.experienceDuration)}
                  {row(t("becomeGuide.preview.guideSessions", "Guide sessions"), formData.experienceSession)}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                {t("becomeGuide.preview.selfAssessment", "Self Assessment")}
              </h3>
              <div className="space-y-4">
                {row(t("becomeGuide.step2.q1Question", "Question 1"), optionLabels(2, "q1", formData.assessmentQ1))}
                {row(t("becomeGuide.step2.q1SliderTitle", "Question 1 score"), score(formData.assessmentQ1Slider))}
                {row(t("becomeGuide.step2.q2Question", "Question 2"), singleOption(2, "q2", formData.assessmentQ2))}
                {row(t("becomeGuide.step2.q3Question", "Question 3"), singleOption(2, "q3", formData.assessmentQ3))}
                {row(t("becomeGuide.step2.q3SliderTitle", "Question 3 score"), score(formData.assessmentQ3Slider))}
                {row(t("becomeGuide.step2.q4Question", "Question 4"), optionLabels(2, "q4", formData.assessmentQ4))}
                {row(t("becomeGuide.step2.q4SliderTitle", "Question 4 score"), score(formData.assessmentQ4Slider))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                {t("becomeGuide.preview.personalizedQuestions", "Personalized Questions")}
              </h3>
              <div className="space-y-4">
                {row(t("becomeGuide.step3.q5Question", "Question 5"), optionLabels(3, "q5", formData.personalizedQ5))}
                {row(t("becomeGuide.step3.q5SliderTitle", "Question 5 score"), score(formData.personalizedQ5Slider))}
                {row(t("becomeGuide.step3.q6Question", "Question 6"), optionLabels(3, "q6", formData.personalizedQ6))}
                {row(t("becomeGuide.step3.q6SliderTitle", "Question 6 score"), score(formData.personalizedQ6Slider))}
                {row(t("becomeGuide.step3.q7Question", "Question 7"), singleOption(3, "q7", formData.personalizedQ7))}
                {row(t("becomeGuide.step3.q7SliderTitle", "Question 7 score"), score(formData.personalizedQ7Slider))}
                {row(t("becomeGuide.step3.q8Question", "Question 8"), optionLabels(3, "q8", formData.personalizedQ8Strengths))}
                {row(t("becomeGuide.step3.q8SliderTitle", "Question 8 score"), score(formData.personalizedQ8Slider))}
                {row(t("becomeGuide.step3.q8ExampleQuestion", "Question 8 example"), formData.personalizedQ8Example)}
                {row(t("becomeGuide.step3.q9Question", "Question 9"), formData.personalizedQ9)}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                {t("becomeGuide.preview.servicePreferences", "Service Preferences")}
              </h3>
              <div className="space-y-4">
                {row(
                  t("becomeGuide.preview.targetGroup", "Target Group"),
                  formData.targetGroup?.length
                    ? formData.targetGroup.map((group) => t(targetGroupLabelKeys[group] ?? group, group)).join(", ")
                    : ph
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {row(
                    t("becomeGuide.preview.serviceRange", "Service Group Size Range"),
                    formData.minPeople && formData.maxPeople
                      ? `${formData.minPeople} - ${formData.maxPeople} ${t("becomeGuide.preview.people", "people")}`
                      : ph
                  )}
                  {row(
                    t("becomeGuide.preview.serviceDuration", "Service Duration Range"),
                    formData.minDuration && formData.maxDuration
                      ? `${formData.minDuration} - ${formData.maxDuration} ${t("becomeGuide.preview.hours", "hours")}`
                      : ph
                  )}
                </div>
                {row(
                  t("becomeGuide.preview.basicPrice", "Basic Hourly Rate"),
                  formData.basicPricePerHour !== undefined
                    ? `${formData.basicPricePerHour.toFixed(2)} USD/${t("becomeGuide.preview.hours", "hours")}`
                    : ph
                )}
                {row(
                  t("becomeGuide.preview.additionalPrice", "Additional Hourly Rate"),
                  formData.additionalPricePerPerson !== undefined
                    ? `${formData.additionalPricePerPerson.toFixed(2)} USD/${t("becomeGuide.preview.people", "people")}/${t("becomeGuide.preview.hours", "hours")}`
                    : ph
                )}
                {row(
                  t("becomeGuide.preview.serviceItems", "Services Provided"),
                  formData.serviceSelections?.length
                    ? t("becomeGuide.preview.selectedItems", "Selected {count} service items", {
                        count: formData.serviceSelections.length,
                      })
                    : t("becomeGuide.preview.notSelected", "Not selected")
                )}
              </div>
            </section>

            {missingFields.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 mb-6">
                <p className="text-sm text-red-700">
                  <strong>{t("becomeGuide.preview.missingFields", "The following information is incomplete:")}</strong>
                  <br />
                  {missingFields.map(formatMissingField).join(t("becomeGuide.preview.fieldSeparator", ", "))}
                </p>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg border-t-4 border-yellow-500">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="confirmation"
                  checked={confirmationChecked}
                  onCheckedChange={(checked: boolean) => setConfirmationChecked(checked === true)}
                  className="mt-1"
                />
                <label htmlFor="confirmation" className="text-sm text-gray-700 leading-relaxed">
                  {t(
                    "becomeGuide.preview.previewDeclaration",
                    "I confirm that all information above is true and accurate."
                  )}
                </label>
              </div>
            </div>

            {requiresAccountBeforeSubmit && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">
                  {t("becomeGuide.preview.accountRequiredTitle", "Account verification required before submission")}
                </p>
                <p className="mt-1 leading-relaxed">
                  {t(
                    "becomeGuide.preview.accountRequiredDescription",
                    "After you continue, you will create or sign in to an account and verify your email so you can return to this application later. Keep this browser open; your draft is saved locally and will resume after verification."
                  )}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-6 border-t">
              <Button type="button" variant="outline" onClick={onBackToForm}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("becomeGuide.preview.backToEdit", "Back to Edit")}
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting
                  ? t("becomeGuide.preview.submitting", "Submitting...")
                  : t("becomeGuide.preview.submitApplication", "Confirm Submit Application")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
