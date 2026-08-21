import type { FormData } from '../types/schema';

export type EvaluationFormValues = Pick<
  FormData,
  | 'assessmentQ1'
  | 'assessmentQ1Slider'
  | 'assessmentQ3'
  | 'assessmentQ3Slider'
  | 'assessmentQ4'
  | 'assessmentQ4Slider'
  | 'personalizedQ6'
  | 'personalizedQ6Slider'
  | 'personalizedQ7'
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

type RetiredEvaluationFormValues = Pick<
  FormData,
  'assessmentQ2' | 'personalizedQ5' | 'personalizedQ5Slider' | 'personalizedQ7Slider'
>;

export const prepareEvaluationPayload = <
  T extends EvaluationFormValues & Partial<RetiredEvaluationFormValues>,
>(
  data: T
) => {
  const {
    assessmentQ1,
    assessmentQ1Slider,
    assessmentQ2: _assessmentQ2,
    assessmentQ3,
    assessmentQ3Slider,
    assessmentQ4,
    assessmentQ4Slider,
    personalizedQ5: _personalizedQ5,
    personalizedQ5Slider: _personalizedQ5Slider,
    personalizedQ6,
    personalizedQ6Slider,
    personalizedQ7,
    personalizedQ7Slider: _personalizedQ7Slider,
    personalizedQ8Strengths,
    personalizedQ8Slider,
    personalizedQ8Example,
    personalizedQ9,
    ...rest
  } = data;
  void _assessmentQ2;
  void _personalizedQ5;
  void _personalizedQ5Slider;
  void _personalizedQ7Slider;

  return {
    ...(rest as object),
    ...evaluationStorageFieldsFromForm({
      assessmentQ1,
      assessmentQ1Slider,
      assessmentQ3,
      assessmentQ3Slider,
      assessmentQ4,
      assessmentQ4Slider,
      personalizedQ6,
      personalizedQ6Slider,
      personalizedQ7,
      personalizedQ8Strengths,
      personalizedQ8Slider,
      personalizedQ8Example,
      personalizedQ9,
    }),
  };
};
