import { useMemo, useState } from "react";
import { Control } from "react-hook-form";
import { useIntl } from "react-intl";
import { MBTI_OPTIONS, SEX_OPTIONS } from "../constants";
import { FormData, GuideFormDestination } from "../types/schema";
import { formatPostalCode, isValidPostalCode, sanitizePostalCode } from "../utils/postalCode";

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
  Textarea: any;
  Checkbox: any;
  YearMonthPicker: any;
  QualificationUploader?: any;
}

interface Step1BasicInfoProps {
  control: Control<FormData>;
  handleQualificationFilesChange: (files: any) => void;
  ui: UIComponents;
  destinations?: GuideFormDestination[];
  destinationsLoading?: boolean;
  destinationsLoadError?: boolean;
  allowCustomDestination?: boolean;
}

const normalizeCustomLocation = (value: string) =>
  value
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ");

const getDestinationLabel = (destination: GuideFormDestination, locale: string) => {
  if (locale.startsWith("zh")) {
    return destination.nameZhCn || destination.nameEn || destination.nameJa || destination.slug;
  }
  if (locale.startsWith("ja")) {
    return destination.nameJa || destination.nameEn || destination.nameZhCn || destination.slug;
  }
  return destination.nameEn || destination.nameJa || destination.nameZhCn || destination.slug;
};

export const Step1BasicInfo = ({
  control,
  handleQualificationFilesChange,
  ui,
  destinations = [],
  destinationsLoading = false,
  destinationsLoadError = false,
  allowCustomDestination = true,
}: Step1BasicInfoProps) => {
  const intl = useIntl();
  const [destinationSearch, setDestinationSearch] = useState("");
  const [customDestination, setCustomDestination] = useState("");
  const sortedDestinations = useMemo(
    () =>
      [...destinations].sort((a, b) => {
        const sortA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
        const sortB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
        if (sortA !== sortB) return sortA - sortB;
        return getDestinationLabel(a, intl.locale).localeCompare(getDestinationLabel(b, intl.locale));
      }),
    [destinations, intl.locale]
  );

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
    Textarea,
    Checkbox,
    YearMonthPicker,
    QualificationUploader,
  } = ui;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {intl.formatMessage({ id: "becomeGuide.step1.basicInfo" })}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="name"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: "becomeGuide.step1.name" })} *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={intl.formatMessage({ id: "becomeGuide.step1.namePlaceholder" })}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="age"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>
                  {intl.formatMessage({ id: "becomeGuide.step1.age" })} *
                  <span className="text-sm text-gray-500 ml-2">
                    ({intl.formatMessage({ id: "becomeGuide.step1.ageRequirement" })})
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="18"
                    max="120"
                    value={field.value?.toString() || ""}
                    onChange={(event: any) => field.onChange(parseInt(event.target.value) || 18)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="sex"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: "becomeGuide.step1.gender" })} *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={intl.formatMessage({
                          id: "becomeGuide.step1.genderPlaceholder",
                        })}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SEX_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {intl.formatMessage({ id: option.labelKey })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="mbti"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>
                  {intl.formatMessage({ id: "becomeGuide.step1.mbti" })}
                  <span className="text-sm text-gray-500 ml-2">
                    ({intl.formatMessage({ id: "becomeGuide.step1.mbtiDescription" })})
                  </span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "ENFJ"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={intl.formatMessage({
                          id: "becomeGuide.step1.mbtiPlaceholder",
                        })}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MBTI_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="socialProfile"
          render={({ field }: any) => (
            <FormItem className="mt-4">
              <FormLabel>{intl.formatMessage({ id: "becomeGuide.step1.socialProfile" })}</FormLabel>
              <FormControl>
                <Input
                  placeholder={intl.formatMessage({
                    id: "becomeGuide.step1.socialProfilePlaceholder",
                  })}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {intl.formatMessage({ id: "becomeGuide.step1.serviceInfo" })}
        </h3>
        <div className="space-y-4">
          <FormField
            control={control}
            name="serviceAreaDestinationIds"
            render={({ field }: any) => {
              const selectedIds = new Set<number>(
                Array.isArray(field.value) ? field.value.map((value: unknown) => Number(value)) : []
              );
              const search = destinationSearch.trim().toLowerCase();
              const selectedDestinations = sortedDestinations.filter((destination) =>
                selectedIds.has(destination.id)
              );
              const availableDestinations = sortedDestinations.filter((destination) => {
                if (selectedIds.has(destination.id)) return false;
                if (!search) return true;
                return [
                  destination.slug,
                  destination.nameEn,
                  destination.nameJa,
                  destination.nameZhCn,
                  destination.prefectureName,
                ]
                  .filter(Boolean)
                  .some((value) => String(value).toLowerCase().includes(search));
              });
              const setSelectedIds = (next: number[]) =>
                field.onChange(Array.from(new Set(next.filter((value) => Number.isFinite(value)))));

              return (
                <FormItem>
                  <FormLabel>
                    {intl.formatMessage({
                      id: "becomeGuide.step1.serviceAreas",
                      defaultMessage: "Where can you host experiences in Japan?",
                    })}{" "}
                    *
                  </FormLabel>
                  <div className="space-y-3">
                    {selectedDestinations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedDestinations.map((destination) => (
                          <button
                            key={destination.id}
                            type="button"
                            className="rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1 text-sm font-medium text-gray-900 hover:bg-yellow-100"
                            onClick={() =>
                              setSelectedIds(
                                Array.from(selectedIds).filter((id) => id !== destination.id)
                              )
                            }
                          >
                            {getDestinationLabel(destination, intl.locale)} x
                          </button>
                        ))}
                      </div>
                    )}
                    <FormControl>
                      <Input
                        value={destinationSearch}
                        onChange={(event: any) => setDestinationSearch(event.target.value)}
                        placeholder={intl.formatMessage({
                          id: "becomeGuide.step1.serviceAreasSearchPlaceholder",
                          defaultMessage: "Search Tokyo, Yokohama, Kyoto...",
                        })}
                      />
                    </FormControl>
                    <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white">
                      {availableDestinations.length ? (
                        availableDestinations.slice(0, 12).map((destination) => (
                          <button
                            key={destination.id}
                            type="button"
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
                            onClick={() => {
                              setSelectedIds([...Array.from(selectedIds), destination.id]);
                              setDestinationSearch("");
                            }}
                          >
                            <span className="font-medium text-gray-900">
                              {getDestinationLabel(destination, intl.locale)}
                            </span>
                            {destination.prefectureName && (
                              <span className="text-xs text-gray-500">
                                {destination.prefectureName}
                              </span>
                            )}
                          </button>
                        ))
                      ) : destinationsLoading ? (
                        <div className="px-3 py-3 text-sm text-gray-500">
                          {intl.formatMessage({
                            id: "becomeGuide.step1.loadingServiceAreas",
                            defaultMessage: "Loading service areas...",
                          })}
                        </div>
                      ) : destinationsLoadError ? (
                        <div className="px-3 py-3 text-sm text-gray-500">
                          {intl.formatMessage({
                            id: "becomeGuide.step1.serviceAreasLoadFailed",
                            defaultMessage:
                              "Service areas could not be loaded. You can add another area below.",
                          })}
                        </div>
                      ) : (
                        <div className="px-3 py-3 text-sm text-gray-500">
                          {intl.formatMessage({
                            id: "becomeGuide.step1.noMatchingServiceAreas",
                            defaultMessage: "No matching destination found.",
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {allowCustomDestination && (
            <FormField
              control={control}
              name="customServiceAreaProposals"
              render={({ field }: any) => {
                const proposals = Array.isArray(field.value) ? field.value : [];
                const addProposal = () => {
                  const nextValue = normalizeCustomLocation(customDestination);
                  if (!nextValue) return;
                  const existing = new Set(
                    proposals.map((value: string) => normalizeCustomLocation(value).toLowerCase())
                  );
                  if (existing.has(nextValue.toLowerCase())) {
                    setCustomDestination("");
                    return;
                  }
                  field.onChange([...proposals, nextValue]);
                  setCustomDestination("");
                };

                return (
                  <FormItem>
                    <FormLabel>
                      {intl.formatMessage({
                        id: "becomeGuide.step1.customServiceAreas",
                        defaultMessage: "Can't find your area?",
                      })}
                    </FormLabel>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <FormControl>
                        <Input
                          value={customDestination}
                          onChange={(event: any) => setCustomDestination(event.target.value)}
                          onKeyDown={(event: any) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              addProposal();
                            }
                          }}
                          placeholder={intl.formatMessage({
                            id: "becomeGuide.step1.customServiceAreasPlaceholder",
                            defaultMessage: "Add another location in Japan",
                          })}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="rounded-md border border-yellow-400 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-yellow-50"
                        onClick={addProposal}
                      >
                        {intl.formatMessage({
                          id: "becomeGuide.step1.addCustomServiceArea",
                          defaultMessage: "Add location",
                        })}
                      </button>
                    </div>
                    {proposals.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {proposals.map((proposal: string) => (
                          <button
                            key={proposal}
                            type="button"
                            className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-900 hover:bg-blue-100"
                            onClick={() =>
                              field.onChange(proposals.filter((value: string) => value !== proposal))
                            }
                          >
                            {proposal} x
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      {intl.formatMessage({
                        id: "becomeGuide.step1.customServiceAreasHelper",
                        defaultMessage:
                          "New areas are reviewed by Yaotu before they become searchable destinations.",
                      })}
                    </p>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}

          <FormField
            control={control}
            name="residenceInfo"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: "becomeGuide.step1.residenceInfo" })}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={intl.formatMessage({
                      id: "becomeGuide.step1.residenceInfoPlaceholder",
                    })}
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
            name="residenceZipcode"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>
                  <span className="mr-1">{"〒"}</span>
                  {intl.formatMessage({
                    id: "becomeGuide.step1.residenceZipcode",
                    defaultMessage: "Postal Code",
                  })}
                </FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    maxLength={8}
                    placeholder={intl.formatMessage({
                      id: "becomeGuide.step1.residenceZipcodePlaceholder",
                      defaultMessage: "123-4567 (or enter 1234567)",
                    })}
                    value={formatPostalCode(field.value || "")}
                    onChange={(event: any) => field.onChange(sanitizePostalCode(event.target.value))}
                  />
                </FormControl>
                <p className="text-xs text-gray-500 mt-1">
                  {intl.formatMessage({
                    id: "becomeGuide.step1.residenceZipcodeHelper",
                    defaultMessage:
                      "Enter a 7-digit Japanese postal code. You can type 1234567 or 123-4567.",
                  })}
                </p>
                {field.value && !isValidPostalCode(field.value) && (
                  <p className="text-sm text-red-500 mt-1">
                    {intl.formatMessage({
                      id: "becomeGuide.step1.residenceZipcodeError",
                      defaultMessage: "Please enter a 7-digit Japanese postal code.",
                    })}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {YearMonthPicker ? (
            <FormField
              control={control}
              name="residenceStartDate"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>
                    {intl.formatMessage({ id: "becomeGuide.step1.residenceStartDate" })}
                  </FormLabel>
                  <FormControl>
                    <YearMonthPicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date: Date) =>
                        field.onChange(date ? date.toISOString().split("T")[0] : "")
                      }
                      placeholder={intl.formatMessage({
                        id: "becomeGuide.step1.residenceStartDatePlaceholder",
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={control}
              name="residenceStartDate"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>
                    {intl.formatMessage({ id: "becomeGuide.step1.residenceStartDate" })}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="month"
                      value={field.value ? String(field.value).slice(0, 7) : ""}
                      onChange={(event: any) =>
                        field.onChange(event.target.value ? `${event.target.value}-01` : "")
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={control}
            name="occupation"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: "becomeGuide.step1.occupation" })}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={intl.formatMessage({
                      id: "becomeGuide.step1.occupationPlaceholder",
                    })}
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
            name="bio"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: "becomeGuide.step1.bio" })}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={intl.formatMessage({ id: "becomeGuide.step1.bioPlaceholder" })}
                    className="min-h-[100px]"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {intl.formatMessage({ id: "becomeGuide.step1.qualifications" })}
        </h3>
        <div className="space-y-4">
          <FormField
            control={control}
            name="languages"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>{intl.formatMessage({ id: "becomeGuide.step1.languages" })}</FormLabel>
                <div className="flex space-x-4">
                  {["chinese", "japanese", "english"].map((languageKey) => (
                    <div key={languageKey} className="flex items-center space-x-2">
                      <Checkbox
                        id={`language-${languageKey}`}
                        checked={field.value?.includes(languageKey) || false}
                        onCheckedChange={(checked: boolean) => {
                          const currentLanguages = field.value || [];
                          if (checked) {
                            field.onChange([...currentLanguages, languageKey]);
                          } else {
                            field.onChange(
                              currentLanguages.filter((lang: string) => lang !== languageKey)
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={`language-${languageKey}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {intl.formatMessage({
                          id: `becomeGuide.step1.languageOptions.${languageKey}`,
                        })}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel className="text-base font-medium">
              {intl.formatMessage({ id: "becomeGuide.step1.experience" })}
            </FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="experienceDuration"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>
                      {intl.formatMessage({ id: "becomeGuide.step1.experienceDuration" })}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={intl.formatMessage({
                          id: "becomeGuide.step1.experienceDurationPlaceholder",
                        })}
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
                name="experienceSession"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>
                      {intl.formatMessage({ id: "becomeGuide.step1.experienceSession" })}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={intl.formatMessage({
                          id: "becomeGuide.step1.experienceSessionPlaceholder",
                        })}
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {QualificationUploader && (
            <FormField
              control={control}
              name="qualifications"
              render={({ field }: any) => (
                <FormItem>
                  <FormControl>
                    <QualificationUploader
                      value={field.value || { certifications: {} }}
                      onChange={(files: any) => {
                        field.onChange(files);
                        handleQualificationFilesChange(files.certifications);
                      }}
                      maxFiles={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};
