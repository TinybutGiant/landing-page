import type { FormData } from '../types/schema';

export type EvaluationFormValues = Pick<
  FormData,
  | 'assessmentQ1'
  | 'assessmentQ1Slider'
  | 'assessmentQ2'
  | 'assessmentQ3'
  | 'assessmentQ3Slider'
  | 'assessmentQ4'
  | 'assessmentQ4Slider'
  | 'personalizedQ5'
  | 'personalizedQ5Slider'
  | 'personalizedQ6'
  | 'personalizedQ6Slider'
  | 'personalizedQ7'
  | 'personalizedQ7Slider'
  | 'personalizedQ8Strengths'
  | 'personalizedQ8Slider'
  | 'personalizedQ8Example'
  | 'personalizedQ9'
>;

export interface StoredEvaluationAnswersV2 extends EvaluationFormValues {
  version: 2;
}

export const evaluationStorageFieldsFromForm = (data: EvaluationFormValues) => ({
  evaluationAnswersV2: {
    version: 2,
    ...data,
  } satisfies StoredEvaluationAnswersV2,
});

export const prepareEvaluationPayload = <T extends EvaluationFormValues>(data: T) => {
  const {
    assessmentQ1,
    assessmentQ1Slider,
    assessmentQ2,
    assessmentQ3,
    assessmentQ3Slider,
    assessmentQ4,
    assessmentQ4Slider,
    personalizedQ5,
    personalizedQ5Slider,
    personalizedQ6,
    personalizedQ6Slider,
    personalizedQ7,
    personalizedQ7Slider,
    personalizedQ8Strengths,
    personalizedQ8Slider,
    personalizedQ8Example,
    personalizedQ9,
    ...rest
  } = data;

  return {
    ...(rest as object),
    ...evaluationStorageFieldsFromForm({
      assessmentQ1,
      assessmentQ1Slider,
      assessmentQ2,
      assessmentQ3,
      assessmentQ3Slider,
      assessmentQ4,
      assessmentQ4Slider,
      personalizedQ5,
      personalizedQ5Slider,
      personalizedQ6,
      personalizedQ6Slider,
      personalizedQ7,
      personalizedQ7Slider,
      personalizedQ8Strengths,
      personalizedQ8Slider,
      personalizedQ8Example,
      personalizedQ9,
    }),
  };
};
