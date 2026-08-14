import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  type FormData,
  type GuideDraftConflict,
  type GuideFormConfig,
  type GuideFunnelState,
} from "../types/schema";
import { validateFormCompleteness } from "../utils/validation";
import { processFormDataForDatabase, processDatabaseDataForForm } from "../utils/currencyUtils";
import { prepareEvaluationPayload } from "../utils/evaluationPayload";
import {
  loadAnonymousDraft,
  markAnonymousDraftConflict,
  markAnonymousDraftMigrated,
  markAnonymousDraftMigrating,
  upsertAnonymousDraft,
} from "../storage/anonymousDraftStorage";
import {
  clearStagedQualificationFiles,
  getStagedQualificationFile,
  listStagedQualificationFiles,
  markStagedQualificationFileUploaded,
} from "../storage/qualificationFileStore";
import {
  getResumePath,
  isAuthenticated,
  isEmailVerified,
  navigateToAuth,
  navigateToVerification,
} from "../utils/guideFunnel";

type InitialStep = "preview" | "resume";
type DraftSource = "anonymous" | "server";

const defaultValues: FormData = {
  name: "",
  age: 18,
  sex: "Male",
  mbti: "ENFJ",
  socialProfile: "",
  assessmentQ1: [],
  assessmentQ1Slider: undefined,
  assessmentQ2: "",
  assessmentQ3: "",
  assessmentQ3Slider: undefined,
  assessmentQ4: [],
  assessmentQ4Slider: undefined,
  serviceCity: "",
  residenceInfo: "",
  residenceZipcode: "",
  residenceStartDate: "",
  occupation: "",
  bio: "",
  qualifications: {
    certifications: {},
  },
  languages: [],
  experienceDuration: "",
  experienceSession: "",
  personalizedQ5: [],
  personalizedQ5Slider: undefined,
  personalizedQ6: [],
  personalizedQ6Slider: undefined,
  personalizedQ7: "",
  personalizedQ7Slider: undefined,
  personalizedQ8Strengths: [],
  personalizedQ8Slider: undefined,
  personalizedQ8Example: "",
  personalizedQ9: "",
  serviceSelections: [],
  targetGroup: [],
  minPeople: 1,
  maxPeople: 10,
  minDuration: 2,
  maxDuration: 8,
  basicPricePerHour: 30,
  additionalPricePerPerson: 5,
  currency: "USD",
};

const toJsonHeaders = (token?: string | null): HeadersInit => {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const toAuthHeaders = (token?: string | null): HeadersInit => {
  const headers: HeadersInit = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const hasMeaningfulLocalDraft = (data: Partial<FormData> | undefined) => {
  if (!data) return false;
  return Boolean(
    data.name?.trim() ||
      data.socialProfile?.trim() ||
      data.assessmentQ1?.length ||
      data.assessmentQ2 ||
      data.assessmentQ3 ||
      data.assessmentQ4?.length ||
      data.personalizedQ5?.length ||
      data.personalizedQ6?.length ||
      data.personalizedQ7 ||
      data.personalizedQ8Strengths?.length ||
      data.personalizedQ9?.trim()
  );
};

const responseJsonOrText = async (response: Response) => {
  if (typeof response.text !== "function") {
    return typeof response.json === "function" ? response.json() : {};
  }
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
};

const extractApplication = (payload: any) => payload?.application ?? payload;

const extractApplicationId = (payload: any) => {
  const application = extractApplication(payload);
  return application?.id ?? payload?.applicationId ?? payload?.id;
};

const prepareDatabasePayload = (data: Partial<FormData>) =>
  processFormDataForDatabase(
    prepareEvaluationPayload({
      ...defaultValues,
      ...data,
    } as FormData)
  );

export const useGuideForm = (
  config: GuideFormConfig,
  onLoadLocalStorage?: () => any,
  onSaveLocalStorage?: (data: any) => void,
  onClearLocalStorage?: () => void,
  initialStep?: InitialStep
) => {
  const resolveApiUrl = config.resolveApiUrl ?? ((path: string) => path);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [savedData, setSavedData] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSource, setDraftSource] = useState<DraftSource>("anonymous");
  const [dbDraftId, setDbDraftId] = useState<string | number | null>(null);
  const [funnelState, setFunnelState] = useState<GuideFunnelState>("anonymous_editing");
  const [draftConflict, setDraftConflict] = useState<GuideDraftConflict | null>(null);
  const submitRequestIdRef = useRef<string | null>(null);
  const resumeHandledRef = useRef(false);
  const serverDraftLoadedRef = useRef(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
  });

  const resetForm = useCallback(
    (data: Partial<FormData>) => {
      const next = {
        ...defaultValues,
        ...processDatabaseDataForForm(data),
        qualifications: data.qualifications ?? defaultValues.qualifications,
        currency: "USD" as const,
      };
      setSavedData(next);
      form.reset(next);
    },
    [form]
  );

  useEffect(() => {
    const anonymousDraft = loadAnonymousDraft();
    const hostDraft = onLoadLocalStorage?.();
    const localData = anonymousDraft?.formData ?? hostDraft;

    if (localData && hasMeaningfulLocalDraft(localData)) {
      resetForm(localData);
    }

    if (initialStep === "preview") {
      setShowPreview(true);
      setFunnelState("preview");
    }
  }, [initialStep, onLoadLocalStorage, resetForm]);

  const loadServerDraft = useCallback(async () => {
    if (!config.apiEndpoints.loadDraft || !isAuthenticated(config) || !isEmailVerified(config)) {
      return null;
    }

    const token = config.auth.getToken();
    const response = await fetch(resolveApiUrl(config.apiEndpoints.loadDraft), {
      method: "GET",
      headers: toAuthHeaders(token),
      credentials: "include",
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw await responseJsonOrText(response);
    }

    const payload = await response.json();
    const application = extractApplication(payload);
    if (!application?.id) return null;

    setDbDraftId(application.id);
    setDraftSource("server");
    setFunnelState("authenticated_editing");
    resetForm(application);
    config.callbacks.onDraftLoaded?.(application);
    return application;
  }, [config, resetForm, resolveApiUrl]);

  const saveAnonymousDraft = useCallback(
    (data: Partial<FormData>, lastCompletedStep: 0 | 1 | 2 | 3 | 4, checkpoint = false) => {
      const draft = upsertAnonymousDraft(data, {
        lastCompletedStep,
        authCheckpointReached: checkpoint,
        migrationStatus: "local",
      });
      onSaveLocalStorage?.(data);
      setSavedData(data);
      config.callbacks.onSaveDraft?.(data);
      return draft;
    },
    [config.callbacks, onSaveLocalStorage]
  );

  const saveServerDraft = useCallback(
    async (data: Partial<FormData>) => {
      if (!config.apiEndpoints.saveDraft) return null;
      const token = config.auth.getToken();
      const payload = prepareDatabasePayload(data);
      const response = await fetch(resolveApiUrl(config.apiEndpoints.saveDraft), {
        method: "PUT",
        headers: toJsonHeaders(token),
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        throw await responseJsonOrText(response);
      }

      const result = await response.json();
      const application = extractApplication(result);
      if (application?.id) {
        setDbDraftId(application.id);
      }
      setDraftSource("server");
      setFunnelState("authenticated_editing");
      setSavedData(data);
      config.callbacks.onSaveDraft?.(result);
      return result;
    },
    [config, resolveApiUrl]
  );

  const uploadPendingQualificationFiles = useCallback(
    async (clientDraftId: string, data: Partial<FormData>) => {
      const token = config.auth.getToken();
      const uploadEndpoint =
        config.apiEndpoints.qualificationUpload ?? "/api/v2/guide-applications/qualification-upload";
      const certifications = { ...(data.qualifications?.certifications ?? {}) };
      const stagedFiles = await listStagedQualificationFiles(clientDraftId);

      for (const staged of stagedFiles) {
        if (staged.uploaded && staged.publicUrl) continue;

        const stored = await getStagedQualificationFile(staged.fileId);
        if (!stored?.blob) continue;

        const body = new globalThis.FormData();
        body.append("file", stored.blob, stored.name);

        const response = await fetch(resolveApiUrl(uploadEndpoint), {
          method: "POST",
          headers: toAuthHeaders(token),
          body,
          credentials: "include",
        });

        if (!response.ok) {
          throw await responseJsonOrText(response);
        }

        const result = await response.json();
        await markStagedQualificationFileUploaded(staged.fileId, {
          publicUrl: result.publicUrl,
          serverFileId: result.fileId,
        });

        certifications[result.fileId ?? staged.fileId] = {
          description: staged.description,
          proof: result.publicUrl,
          visible: staged.visible !== false,
          uploaded: true,
          publicUrl: result.publicUrl,
        };
      }

      return {
        ...data,
        qualifications: {
          ...(data.qualifications ?? {}),
          certifications,
        },
      };
    },
    [config, resolveApiUrl]
  );

  const handoffAnonymousDraft = useCallback(async () => {
    if (!isAuthenticated(config)) {
      setFunnelState("auth_required");
      navigateToAuth(config);
      return null;
    }

    if (!isEmailVerified(config)) {
      setFunnelState("verification_required");
      navigateToVerification(config);
      return null;
    }

    const draft = loadAnonymousDraft() ?? saveAnonymousDraft(form.getValues(), 3, true);
    const data = draft.formData && hasMeaningfulLocalDraft(draft.formData) ? draft.formData : form.getValues();
    const endpoint = config.apiEndpoints.handoffDraft;

    if (!endpoint) {
      setDraftSource("server");
      setFunnelState("authenticated_editing");
      return { application: data };
    }

    markAnonymousDraftMigrating();
    setFunnelState("resume_after_auth");

    const token = config.auth.getToken();
    const response = await fetch(resolveApiUrl(endpoint), {
      method: "POST",
      headers: toJsonHeaders(token),
      body: JSON.stringify({
        clientDraftId: draft.clientDraftId,
        clientUpdatedAt: draft.updatedAt,
        anonymousDraftVersion: draft.draftVersion,
        data: prepareDatabasePayload(data),
      }),
      credentials: "include",
    });

    const result = await responseJsonOrText(response);

    if (response.status === 409) {
      const conflict = result as GuideDraftConflict;
      setDraftConflict(conflict);
      markAnonymousDraftConflict(conflict.reason ?? "existing_server_draft");
      config.callbacks.onHandoffConflict?.(conflict);
      setFunnelState("resume_after_auth");
      return null;
    }

    if (!response.ok) {
      upsertAnonymousDraft(data, {
        lastCompletedStep: 3,
        authCheckpointReached: true,
        migrationStatus: "local",
      });
      throw result;
    }

    const application = extractApplication(result);
    const applicationId = extractApplicationId(result);
    setDbDraftId(applicationId ?? null);
    setDraftSource("server");

    let hydrated = processDatabaseDataForForm(application ?? data);
    try {
      hydrated = await uploadPendingQualificationFiles(draft.clientDraftId, hydrated);
      if (applicationId) {
        await saveServerDraft(hydrated);
        await clearStagedQualificationFiles(draft.clientDraftId);
      }
    } catch (error) {
      config.callbacks.onError?.(error);
    }

    resetForm(hydrated);
    markAnonymousDraftMigrated(applicationId);
    onClearLocalStorage?.();
    setFunnelState("authenticated_editing");
    setCurrentPage(4);
    config.callbacks.onHandoffSuccess?.(result);
    return result;
  }, [
    config,
    form,
    onClearLocalStorage,
    resetForm,
    resolveApiUrl,
    saveAnonymousDraft,
    saveServerDraft,
    uploadPendingQualificationFiles,
  ]);

  useEffect(() => {
    if (initialStep !== "resume" || resumeHandledRef.current) return;
    resumeHandledRef.current = true;

    void (async () => {
      try {
        await handoffAnonymousDraft();
      } catch (error) {
        config.callbacks.onError?.(error);
      }
    })();
  }, [config.callbacks, handoffAnonymousDraft, initialStep]);

  useEffect(() => {
    if (serverDraftLoadedRef.current) return;
    if (!isAuthenticated(config) || !isEmailVerified(config)) return;
    if (hasMeaningfulLocalDraft(loadAnonymousDraft()?.formData)) return;

    serverDraftLoadedRef.current = true;
    void loadServerDraft().catch((error) => {
      config.callbacks.onError?.(error);
    });
  }, [config, loadServerDraft]);

  const saveDraft = async (data: FormData) => {
    try {
      setIsSaving(true);
      if (draftSource === "server" && isAuthenticated(config) && isEmailVerified(config)) {
        return await saveServerDraft(data);
      }
      return saveAnonymousDraft(data, currentPage > 0 ? ((currentPage - 1) as 0 | 1 | 2 | 3) : 0);
    } catch (error) {
      config.callbacks.onError?.(error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const saveCurrentPageData = () => {
    const currentData = form.getValues();
    void saveDraft(currentData);
  };

  const nextPage = async () => {
    const data = form.getValues();

    if (currentPage < 3) {
      saveAnonymousDraft(data, currentPage as 1 | 2);
      setCurrentPage(currentPage + 1);
      return;
    }

    if (currentPage === 3) {
      saveAnonymousDraft(data, 3, true);
      const result = await handoffAnonymousDraft();
      if (result) {
        setCurrentPage(4);
      }
      return;
    }

    if (currentPage < 4) {
      await saveDraft(data);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPreview = async () => {
    const data = form.getValues();
    if (draftSource !== "server") {
      const result = await handoffAnonymousDraft();
      if (!result) return;
    } else {
      await saveDraft(data);
    }
    setFunnelState("preview");
    setShowPreview(true);
  };

  const backToForm = () => {
    setMissingFields([]);
    setShowPreview(false);
    setFunnelState(draftSource === "server" ? "authenticated_editing" : "anonymous_editing");
  };

  const submitToDatabase = async (data: FormData) => {
    const token = config.auth.getToken();
    const userId = config.auth.getUserId();
    const processedData = processFormDataForDatabase(
      prepareEvaluationPayload({
        ...data,
        userId,
        applicationStatus: "pending",
      })
    );

    const applicationId = dbDraftId ?? data.id;
    const endpoint =
      applicationId && config.apiEndpoints.updateApplication
        ? config.apiEndpoints.updateApplication(applicationId)
        : applicationId
          ? `${config.apiEndpoints.submitApplication}/${applicationId}`
          : config.apiEndpoints.submitApplication;
    const method = applicationId ? "PUT" : "POST";

    const response = await fetch(resolveApiUrl(endpoint), {
      method,
      headers: toJsonHeaders(token),
      body: JSON.stringify(processedData),
      credentials: "include",
    });

    if (!response.ok) {
      throw await responseJsonOrText(response);
    }

    const result = await response.json();
    const nextApplicationId = extractApplicationId(result);

    if (nextApplicationId && typeof localStorage !== "undefined") {
      localStorage.setItem("yaotu_application_id", nextApplicationId.toString());
    }

    setFunnelState("submitted");
    return result;
  };

  const submitApplication = async (data: FormData) => {
    if (isSubmitting || submitRequestIdRef.current !== null) {
      return;
    }

    if (!isAuthenticated(config)) {
      saveAnonymousDraft(data, 3, true);
      setFunnelState("auth_required");
      navigateToAuth(config);
      return;
    }

    if (!isEmailVerified(config)) {
      saveAnonymousDraft(data, 3, true);
      setFunnelState("verification_required");
      navigateToVerification(config);
      return;
    }

    if (draftSource !== "server") {
      const result = await handoffAnonymousDraft();
      if (!result) return;
    }

    const requestId = `${Date.now()}${Math.random().toString(36).slice(2, 11)}`;

    try {
      setIsLoading(true);
      setIsSubmitting(true);
      submitRequestIdRef.current = requestId;
      const result = await submitToDatabase({ ...data, userId: config.auth.getUserId() ?? undefined });
      config.callbacks.onSuccess?.(result);
      return result;
    } catch (error) {
      config.callbacks.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
      submitRequestIdRef.current = null;
    }
  };

  const onSubmit = async () => {
    if (isSubmitting) return;
    if (!confirmationChecked) return;

    const finalData = form.getValues();
    const missing = validateFormCompleteness(finalData);
    if (missing.length > 0) {
      setMissingFields(missing);
      return;
    }

    setMissingFields([]);
    await submitApplication(finalData);
  };

  const handleQualificationFilesChange = (files: any) => {
    form.setValue("qualifications.certifications", files);
  };

  const acceptServerDraft = async () => {
    const serverDraft = await loadServerDraft();
    if (serverDraft) {
      setDraftConflict(null);
      setCurrentPage(4);
      setDraftSource("server");
    }
  };

  return {
    currentPage,
    setCurrentPage,
    showPreview,
    setShowPreview,
    confirmationChecked,
    setConfirmationChecked,
    missingFields,
    setMissingFields,
    savedData,
    setSavedData,
    isLoading,
    isSaving,
    isSubmitting,
    draftSource,
    dbDraftId,
    funnelState,
    draftConflict,
    resumePath: getResumePath(config),

    form,

    saveCurrentPageData,
    handleQualificationFilesChange,
    saveDraft,
    submitApplication,
    nextPage,
    prevPage,
    goToPreview,
    backToForm,
    onSubmit,
    validateFormCompleteness,
    handoffAnonymousDraft,
    acceptServerDraft,
  };
};
