import type { FormData } from "../types/schema";

export const ANONYMOUS_DRAFT_VERSION = 1;
export const ANONYMOUS_DRAFT_STORAGE_KEY = "yaotu_guide_application_anonymous_draft_v1";
export const LEGACY_GUIDE_FORM_DRAFT_KEY = "yaotu_guide_form_draft";
export const LEGACY_QUALIFICATION_FILES_KEY = "yaotu_qualification_files";

export type AnonymousDraftMigrationStatus =
  | "local"
  | "migrating"
  | "migrated"
  | "conflict"
  | "superseded";

export interface AnonymousGuideDraft {
  draftVersion: typeof ANONYMOUS_DRAFT_VERSION;
  clientDraftId: string;
  formData: Partial<FormData>;
  lastCompletedStep: 0 | 1 | 2 | 3 | 4;
  authCheckpointReached: boolean;
  updatedAt: string;
  migrationStatus: AnonymousDraftMigrationStatus;
  migratedAt?: string;
  dbDraftId?: string | number;
  conflictReason?: string;
}

const canUseLocalStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const nowIso = () => new Date().toISOString();

const makeClientDraftId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

const parseJson = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeStep = (value: unknown): 0 | 1 | 2 | 3 | 4 => {
  const numeric = typeof value === "number" ? value : Number(value);
  if (numeric >= 4) return 4;
  if (numeric >= 3) return 3;
  if (numeric >= 2) return 2;
  if (numeric >= 1) return 1;
  return 0;
};

export const createAnonymousDraft = (
  formData: Partial<FormData> = {},
  options: {
    clientDraftId?: string;
    lastCompletedStep?: 0 | 1 | 2 | 3 | 4;
    authCheckpointReached?: boolean;
    migrationStatus?: AnonymousDraftMigrationStatus;
    updatedAt?: string;
  } = {}
): AnonymousGuideDraft => ({
  draftVersion: ANONYMOUS_DRAFT_VERSION,
  clientDraftId: options.clientDraftId ?? makeClientDraftId(),
  formData,
  lastCompletedStep: options.lastCompletedStep ?? 0,
  authCheckpointReached: options.authCheckpointReached ?? false,
  updatedAt: options.updatedAt ?? nowIso(),
  migrationStatus: options.migrationStatus ?? "local",
});

const normalizeDraft = (raw: unknown): AnonymousGuideDraft | null => {
  if (!isObject(raw)) return null;

  const formData = isObject(raw.formData)
    ? (raw.formData as Partial<FormData>)
    : (raw as Partial<FormData>);

  return createAnonymousDraft(formData, {
    clientDraftId:
      typeof raw.clientDraftId === "string" && raw.clientDraftId.trim()
        ? raw.clientDraftId
        : undefined,
    lastCompletedStep: normalizeStep(raw.lastCompletedStep),
    authCheckpointReached: raw.authCheckpointReached === true,
    migrationStatus:
      raw.migrationStatus === "migrated" ||
      raw.migrationStatus === "migrating" ||
      raw.migrationStatus === "conflict" ||
      raw.migrationStatus === "superseded"
        ? raw.migrationStatus
        : "local",
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
  });
};

export const loadAnonymousDraft = (): AnonymousGuideDraft | null => {
  if (!canUseLocalStorage()) return null;

  const current = normalizeDraft(
    parseJson<unknown>(window.localStorage.getItem(ANONYMOUS_DRAFT_STORAGE_KEY))
  );
  if (current) return current;

  const legacy = normalizeDraft(
    parseJson<unknown>(window.localStorage.getItem(LEGACY_GUIDE_FORM_DRAFT_KEY))
  );
  if (!legacy) return null;

  saveAnonymousDraft(legacy);
  return legacy;
};

export const saveAnonymousDraft = (draft: AnonymousGuideDraft) => {
  if (!canUseLocalStorage()) return draft;
  window.localStorage.setItem(ANONYMOUS_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  return draft;
};

export const loadOrCreateAnonymousDraft = (
  initialData: Partial<FormData> = {}
): AnonymousGuideDraft => {
  const existing = loadAnonymousDraft();
  if (existing) return existing;
  return saveAnonymousDraft(createAnonymousDraft(initialData));
};

export const upsertAnonymousDraft = (
  formData: Partial<FormData>,
  options: {
    lastCompletedStep?: 0 | 1 | 2 | 3 | 4;
    authCheckpointReached?: boolean;
    migrationStatus?: AnonymousDraftMigrationStatus;
  } = {}
): AnonymousGuideDraft => {
  const existing = loadAnonymousDraft();
  const draft = createAnonymousDraft(formData, {
    clientDraftId: existing?.clientDraftId,
    lastCompletedStep: options.lastCompletedStep ?? existing?.lastCompletedStep ?? 0,
    authCheckpointReached:
      options.authCheckpointReached ?? existing?.authCheckpointReached ?? false,
    migrationStatus: options.migrationStatus ?? existing?.migrationStatus ?? "local",
  });

  draft.migratedAt = existing?.migratedAt;
  draft.dbDraftId = existing?.dbDraftId;
  draft.conflictReason = existing?.conflictReason;
  return saveAnonymousDraft(draft);
};

export const markAnonymousDraftMigrating = () => {
  const existing = loadAnonymousDraft();
  if (!existing) return null;
  return saveAnonymousDraft({
    ...existing,
    migrationStatus: "migrating",
    updatedAt: nowIso(),
  });
};

export const markAnonymousDraftMigrated = (dbDraftId?: string | number) => {
  const existing = loadAnonymousDraft();
  if (!existing) return null;
  return saveAnonymousDraft({
    ...existing,
    formData: {},
    migrationStatus: "migrated",
    migratedAt: nowIso(),
    dbDraftId,
    updatedAt: nowIso(),
  });
};

export const markAnonymousDraftConflict = (reason: string) => {
  const existing = loadAnonymousDraft();
  if (!existing) return null;
  return saveAnonymousDraft({
    ...existing,
    migrationStatus: reason === "stale_local_draft" ? "superseded" : "conflict",
    conflictReason: reason,
    updatedAt: nowIso(),
  });
};

export const clearAnonymousDraft = () => {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(ANONYMOUS_DRAFT_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_GUIDE_FORM_DRAFT_KEY);
  window.localStorage.removeItem(LEGACY_QUALIFICATION_FILES_KEY);
};
