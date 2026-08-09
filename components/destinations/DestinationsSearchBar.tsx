import { DESTINATION_CATEGORY_OPTIONS, DESTINATION_COUNTRIES } from "@/constants/destinations";
import type { DestinationFilters } from "@/features/destinations/lib/filterDestinations";

interface DestinationsSearchBarProps {
  filters: DestinationFilters;
  onChange: (filters: DestinationFilters) => void;
}

export function DestinationsSearchBar({ filters, onChange }: DestinationsSearchBarProps) {
  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Recherchez une destination..."
        aria-label="Rechercher une destination"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <select
        aria-label="Sélectionner un pays"
        value={filters.country}
        onChange={(e) => onChange({ ...filters, country: e.target.value })}
      >
        {DESTINATION_COUNTRIES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Sélectionner une catégorie"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      >
        {DESTINATION_CATEGORY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
