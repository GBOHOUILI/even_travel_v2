import { EVENT_CATEGORY_OPTIONS, EVENT_DIFFICULTY_OPTIONS } from "@/constants/events";
import type { EventFilters } from "@/features/events/lib/filterEvents";

interface EventsSearchBarProps {
  filters: EventFilters;
  onChange: (filters: EventFilters) => void;
}

export function EventsSearchBar({ filters, onChange }: EventsSearchBarProps) {
  return (
    <div className="searchbar text-gray-500">
      <input
        type="text"
        placeholder="Recherchez un événement..."
        aria-label="Rechercher un événement"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <select
        aria-label="Sélectionner une catégorie"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      >
        {EVENT_CATEGORY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Sélectionner une difficulté"
        value={filters.difficulty}
        onChange={(e) => onChange({ ...filters, difficulty: e.target.value })}
      >
        {EVENT_DIFFICULTY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
