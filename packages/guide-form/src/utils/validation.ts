import { FormData } from "../types/schema";

export const validateEvaluationQuestions = (formData: Partial<FormData>): string[] => {
  const missingFields: string[] = [];

  if (!formData.assessmentQ1?.length) missingFields.push("becomeGuide.step2.q1Question");
  if (formData.assessmentQ1Slider == null)
    missingFields.push("becomeGuide.step2.q1SliderTitle");
  if (!formData.assessmentQ3) missingFields.push("becomeGuide.step2.q3Question");
  if (formData.assessmentQ3Slider == null)
    missingFields.push("becomeGuide.step2.q3SliderTitle");
  if (!formData.assessmentQ4?.length) missingFields.push("becomeGuide.step2.q4Question");
  if (formData.assessmentQ4Slider == null)
    missingFields.push("becomeGuide.step2.q4SliderTitle");
  if (!formData.personalizedQ6?.length) missingFields.push("becomeGuide.step3.q6Question");
  if (formData.personalizedQ6Slider == null)
    missingFields.push("becomeGuide.step3.q6SliderTitle");
  if (!formData.personalizedQ7) missingFields.push("becomeGuide.step3.q7Question");
  if (!formData.personalizedQ8Strengths?.length)
    missingFields.push("becomeGuide.step3.q8Question");
  if (formData.personalizedQ8Slider == null)
    missingFields.push("becomeGuide.step3.q8SliderTitle");
  if (!formData.personalizedQ8Example?.trim())
    missingFields.push("becomeGuide.step3.q8ExampleQuestion");
  if (!formData.personalizedQ9?.trim()) missingFields.push("becomeGuide.step3.q9Question");

  return missingFields;
};

export const validateFormCompleteness = (formData: Partial<FormData>): string[] => {
  const missingFields: string[] = [];

  if (!formData.name?.trim()) missingFields.push("becomeGuide.preview.name");
  if (!formData.age || formData.age < 18 || formData.age > 120)
    missingFields.push("becomeGuide.preview.age");
  if (!formData.sex) missingFields.push("becomeGuide.preview.gender");
  if (!formData.mbti) missingFields.push("becomeGuide.preview.mbti");

  if (
    !formData.serviceAreaDestinationIds?.length &&
    !formData.customServiceAreaProposals?.length &&
    !formData.serviceAreas?.length
  ) {
    missingFields.push("becomeGuide.preview.serviceAreas");
  }
  if (!formData.residenceStartDate)
    missingFields.push("becomeGuide.preview.residenceStartDate");
  if (!formData.residenceInfo?.trim()) missingFields.push("becomeGuide.preview.residenceInfo");
  if (!formData.residenceZipcode?.trim())
    missingFields.push("becomeGuide.preview.residenceZipcode");
  if (!formData.occupation?.trim()) missingFields.push("becomeGuide.preview.occupation");
  if (!formData.languages?.length) missingFields.push("becomeGuide.preview.languages");
  if (!formData.experienceDuration) missingFields.push("becomeGuide.preview.guideExperience");
  if (!formData.experienceSession) missingFields.push("becomeGuide.preview.guideSessions");

  missingFields.push(...validateEvaluationQuestions(formData));

  if (!formData.serviceSelections?.length) missingFields.push("becomeGuide.preview.serviceItems");
  if (!formData.targetGroup?.length) missingFields.push("becomeGuide.preview.targetGroup");
  if (!formData.minPeople || !formData.maxPeople) missingFields.push("becomeGuide.preview.serviceRange");
  if (!formData.minDuration || !formData.maxDuration)
    missingFields.push("becomeGuide.preview.serviceDuration");
  if (
    formData.basicPricePerHour === undefined ||
    formData.basicPricePerHour === null ||
    formData.basicPricePerHour < 0
  ) {
    missingFields.push("becomeGuide.preview.basicPrice");
  }
  if (
    formData.additionalPricePerPerson === undefined ||
    formData.additionalPricePerPerson === null ||
    formData.additionalPricePerPerson < 0
  ) {
    missingFields.push("becomeGuide.preview.additionalPrice");
  }

  return Array.from(new Set(missingFields));
};
