export interface GuideServiceSubcategory {
  id: number;
  categoryId: number;
  nameCn: string;
  nameEn: string;
  isCustom: boolean;
}

export interface GuideServiceCategory {
  id: number;
  nameCn: string;
  nameEn: string;
  subcategories: GuideServiceSubcategory[];
}

export const loadConfiguredServiceCategories = async (
  endpoint: string
): Promise<GuideServiceCategory[]> => {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to load service categories: ${response.status}`);
  }

  const result: unknown = await response.json();
  if (!Array.isArray(result)) {
    throw new Error('Service categories response must be an array');
  }

  return result as GuideServiceCategory[];
};
