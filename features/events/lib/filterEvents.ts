import type { Event } from "@/types/event";

/** Un événement sans date n'est jamais considéré comme terminé (permanent / "à venir"). */
export function isEventPast(event: Pick<Event, "date">): boolean {
  return Boolean(event.date && new Date(event.date) < new Date());
}

export interface EventFilters {
  search: string;
  category: string;
  difficulty: string;
}

export const DEFAULT_EVENT_FILTERS: EventFilters = {
  search: "",
  category: "all",
  difficulty: "all",
};

export function filterEvents(events: Event[], filters: EventFilters): Event[] {
  const search = filters.search.toLowerCase().trim();
  const category = filters.category.toLowerCase();
  const difficulty = filters.difficulty.toLowerCase();

  return events.filter((event) => {
    const title = event.nom?.toLowerCase() ?? "";
    const eventCategory = event.categorie?.toLowerCase() ?? "";
    const eventDifficulty = event.difficulte?.toLowerCase() ?? "";

    const matchSearch = title.includes(search);
    const matchCategory = category === "all" || eventCategory.includes(category);
    const matchDifficulty = difficulty === "all" || eventDifficulty.includes(difficulty);

    return matchSearch && matchCategory && matchDifficulty;
  });
}
