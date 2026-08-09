import type { Destination } from "@/types/destination";

export interface DestinationFilters {
  search: string;
  country: string;
  category: string;
}

export const DEFAULT_DESTINATION_FILTERS: DestinationFilters = {
  search: "",
  country: "all",
  category: "all",
};

export function filterDestinations(
  destinations: Destination[],
  filters: DestinationFilters,
): Destination[] {
  const search = filters.search.toLowerCase().trim();
  const country = filters.country.toLowerCase();
  const category = filters.category.toLowerCase();

  return destinations.filter((destination) => {
    const title = destination.titre?.toLowerCase() ?? "";
    const localisation = destination.localisation?.toLowerCase() ?? "";
    const destCategory = destination.categorie?.toLowerCase() ?? "";

    const matchSearch = title.includes(search);
    const matchCountry = country === "all" || localisation.includes(country);
    const matchCategory = category === "all" || destCategory.includes(category);

    return matchSearch && matchCountry && matchCategory;
  });
}
